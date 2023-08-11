import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Box, CircularProgress, Textarea } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import CustomConnect from "./CustomConnect";
import { useAccount } from "wagmi";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useNoteContext } from "@/contexts/NoteContext";

type CreateNoteProps =
  | {
      type: "create";
    }
  | {
      type: "edit";
      id: string;
      note: { title: string; content: string; address: string; date: number };
    };

export default function CreateNote(props: CreateNoteProps) {
  const { type } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState(
    type === "edit" ? props.note.title : ""
  );
  const [content, setContent] = React.useState(
    type === "edit" ? props.note.content : ""
  );
  const [entryStatus, setEntryStatus] = React.useState<
    "primary" | "warning" | "danger"
  >("primary");
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { isConnected: isLoggedIn } = useAccount();
  const { createNote, updateNote } = useNoteContext();

  React.useEffect(() => {
    if (280 - content.length <= 20 && 280 - content.length > 5) {
      setEntryStatus("warning");
    } else if (280 - content.length <= 5) {
      setEntryStatus("danger");
    } else {
      setEntryStatus("primary");
    }
  }, [content]);

  React.useEffect(() => {
    if (isLoggedIn) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [isLoggedIn]);

  return (
    <React.Fragment>
      {type === "create" && !isConnected && <CustomConnect />}

      {isConnected && type === "create" && (
        <Button
          onClick={() => setOpen(true)}
          startDecorator={<AddIcon />}
          sx={{
            width: ["100%", "100%", "auto"],
            my: [2, 2, "0"],
          }}
          variant="solid"
        >
          Create new note
        </Button>
      )}

      {type === "edit" && (
        <Button
          variant="soft"
          color="primary"
          sx={{ px: 1.5 }}
          onClick={() => setOpen(true)}
        >
          <ModeEditOutlineIcon />
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 600, width: "95%" }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            {type === "create" ? "Create new note" : "Edit note"}
          </Typography>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setIsSubmitting(true);
              try {
                if (type === "create" && createNote) {
                  await createNote(title, content);
                  setOpen(false);
                }
                if (type === "edit" && updateNote) {
                  await updateNote(props.id, { ...props.note, title, content });
                  setOpen(false);
                }
                setContent("");
                setTitle("");
              } catch (e) {
                console.log(e);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Content</FormLabel>
                <Textarea
                  minRows={7}
                  maxRows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  error={content.length > 280}
                />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                {content.length >= 290 ? (
                  <Typography level="body-sm" color="danger">
                    {280 - content.length}
                  </Typography>
                ) : (
                  <CircularProgress
                    color={entryStatus}
                    determinate
                    value={(content.length / 280) * 100}
                    thickness={3}
                    sx={{
                      "--CircularProgress-size": "30px",
                      "--CircularProgress-colorDanger": {
                        backgroundColor: "blue",
                      },
                    }}
                  >
                    <Typography
                      level="body-sm"
                      color={280 - content.length <= 5 ? "danger" : "neutral"}
                    >
                      {280 - content.length <= 20 && 280 - content.length > -10
                        ? `${280 - content.length}`
                        : null}
                    </Typography>
                  </CircularProgress>
                )}
                <Button
                  type="submit"
                  sx={{
                    fontSize: ".9rem",
                    borderRadius: "50px",
                    px: 4,
                  }}
                  loading={isSubmitting}
                  disabled={content.length === 0 || content.length > 280 || isSubmitting}
                >
                  {type === "create" ? "Save" : "Update"}
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}