import { createContext, useContext, useEffect, useState } from "react";
//@ts-ignore
import WeaveDB from "weavedb-sdk";
import { useAccount } from "wagmi";

type INote = { date: number; title: string; content: string; address: string };

export interface INoteContextProps {
  notes: {
    data: INote;
    id: string;
  }[];
  fetchNotes: () => void;
  createNote: (title: string, content: string) => Promise<unknown>;
  deleteNote: (id: string) => Promise<unknown>;
  updateNote: (
    id: string,
    note: { title: string; content: string; address: string; date: number }
  ) => Promise<unknown>;
}

const defaultState: INoteContextProps = {
  notes: [],
  fetchNotes: () => {},
  createNote: () => Promise.resolve(),
  deleteNote: () => Promise.resolve(),
  updateNote: () => Promise.resolve(),
};

export const NoteContext = createContext<INoteContextProps>(defaultState);
const contractTxId = "qiZtbc9_t0opE4G95nnHwGyp0hXOJ_XQnSt9fedH1Ic";

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbInstance, setDbInstance] = useState<typeof WeaveDB>(null);
  const [notes, setNotes] = useState<
    {
      data: INote;
      id: string;
    }[]
  >([]);
  const { address } = useAccount();

  useEffect(() => {
    const init = async () => {
      const _db = new WeaveDB({
        contractTxId,
      });
      await _db.init();
      setDbInstance(_db);
    };
    init();
  }, []);

  useEffect(() => {
    if (dbInstance && address) {
      fetchNotes();
    }
  }, [dbInstance, address]);

  const fetchNotes = async () => {
    let notes = await dbInstance.cget(
      "notes",
      ["user_address", "==", address],
      ["date", "desc"]
    );
    setNotes(notes);
  };

  const createNote = async (title: string, content: string) => {
    console.log("Creating note...");
    try {
      const note = await dbInstance.add(
        {
          date: Date.now(),
          title,
          content,
          user_address: address,
        },
        "notes"
      );
      if (note.success) {
        console.log("Note created!");
        fetchNotes();
      }
    } catch (error) {
      return error;
    }
  };

  const deleteNote = async (id: string) => {
    console.log("Deleting note...");
    try {
      await dbInstance.delete("notes", id);
      await fetchNotes();
    } catch (error) {
      return error;
    }
  };

  const updateNote = async (id: string, note: INote) => {
    try {
      await dbInstance.update(note, "notes", id);
      await fetchNotes();
    } catch (error) {
      return error;
    }
  };

  const noteContextValue: INoteContextProps = {
    notes,
    fetchNotes,
    createNote,
    deleteNote,
    updateNote,
  };

  return (
    <NoteContext.Provider value={noteContextValue}>
      {children}
    </NoteContext.Provider>
  );
};

export function useNoteContext() {
  return useContext(NoteContext);
}
