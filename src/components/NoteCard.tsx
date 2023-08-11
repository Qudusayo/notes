import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { Button, Divider, Modal, ModalDialog } from "@mui/joy";
import DeleteForever from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CreateNote from "./CreateNote";
import { useNoteContext } from "@/contexts/NoteContext";

export default function NoteCard({
  id,
  note,
}: {
  id: string;
  note: { date: number; title: string; content: string; address: string };
}) {
  return (
    <Card
      sx={{
        gap: 1,
        width: "100%",
        height: "250px",
        pb: 1,
      }}
    >
      {note.title && (
        <Typography
          level="title-lg"
          fontWeight="lg"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            "-webkit-line-clamp": 1,
            "-webkit-box-orient": "vertical",
            height: "4rem",
          }}
        >
          {note.title}
        </Typography>
      )}
      <Typography
        level="body-md"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          "-webkit-line-clamp": 3,
          "-webkit-box-orient": "vertical",
          flexGrow: 1,
          height: "14rem",
        }}
      >
        {note.content}
      </Typography>
      <Divider />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flex={1}
      >
        <Typography level="body-sm">
          {new Date(note.date).toLocaleString()}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <CreateNote type="edit" id={id} note={note} />
          <DiscardDialogModal id={id} />
        </Box>
      </Box>
    </Card>
  );
}

function DiscardDialogModal({ id }: { id: string }) {
  const { deleteNote } = useNoteContext();
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Button
        variant="soft"
        color="danger"
        sx={{ px: 1.5 }}
        onClick={() => setOpen(true)}
      >
        <DeleteForever />
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
        >
          <Typography
            id="alert-dialog-modal-title"
            level="h2"
            startDecorator={<WarningRoundedIcon />}
          >
            Confirmation
          </Typography>
          <Divider />
          <Typography
            id="alert-dialog-modal-description"
            textColor="text.tertiary"
          >
            Are you sure you want to discard all of your note?
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={async () => {
                setDeleting(true);
                deleteNote?.(id)
                  .then(() => {
                    setOpen(false);
                  })
                  .catch(() => {})
                  .finally(() => {
                    setDeleting(false);
                  });
              }}
              loading={deleting}
            >
              Discard note
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
