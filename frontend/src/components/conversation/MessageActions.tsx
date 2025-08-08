import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Info } from "lucide-react";
import { type ToolCall } from "../../utils/toolCallParser";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  toolCalls?: ToolCall[];
  thinking?: string;
}

interface MessageActionsProps {
  message: Message;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ message }) => {
  return (
    <div className="mt-2 flex justify-start">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Info className="h-3 w-3 mr-1" />
            Raw JSON
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Raw JSON</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <pre className="text-xs whitespace-pre-wrap break-all font-mono">
              {JSON.stringify(message, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
