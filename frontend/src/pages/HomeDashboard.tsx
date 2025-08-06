import React from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "../contexts/ConversationContext";
import { CliWarnings } from "../components/CliWarnings";
import { MessageContent } from "../components/MessageContent";
import { ThinkingBlock } from "../components/ThinkingBlock";
import { ToolCallDisplay } from "../components/ToolCallDisplay";
import { GeminiLogo } from "../components/GeminiLogo";
import { GeminiIcon } from "../components/GeminiIcon";
import { GeminiText } from "../components/GeminiText";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Info, UserRound, FolderKanban } from "lucide-react";
import { ModelContextProtocol } from "@/components/ModelContextProtocol";

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentConversation,
    isCliInstalled,
    messagesContainerRef,
    handleConfirmToolCall,
    confirmationRequests,
    selectedModel,
  } = useConversation();

  return (
    <>
      <CliWarnings 
        selectedModel={selectedModel}
        isCliInstalled={isCliInstalled}
      />

      {currentConversation ? (
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto p-6 relative"
        >
          <div className="space-y-8 pb-4 max-w-4xl mx-auto">
            {currentConversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={`w-full ${
                  message.sender === "user" ? "flex justify-start" : ""
                }`}
              >
                <div className="w-full">
                  {/* Header with logo and timestamp */}
                  <div className="flex items-center gap-2 mb-4">
                    {message.sender === "assistant" ? (
                      <div>
                        <GeminiLogo />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-5.5 flex items-center justify-center overflow-hidden rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle, #346bf1 0%, #3186ff 50%, #4fa0ff 100%)",
                            }}
                          >
                            <UserRound className="size-4" />
                          </div>
                          User
                        </div>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {message.parts.map((msgPart) =>
                    msgPart.type === "thinking" ? (
                      <ThinkingBlock thinking={msgPart.thinking} />
                    ) : msgPart.type === "text" ? (
                      /* Message Content */
                      <div className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                        <MessageContent
                          content={msgPart.text}
                          sender={message.sender}
                        />
                      </div>
                    ) : msgPart.type === "toolCall" ? (
                      <ToolCallDisplay 
                        toolCall={msgPart.toolCall}
                        hasConfirmationRequest={confirmationRequests.has(msgPart.toolCall.id)}
                        onConfirm={handleConfirmToolCall}
                      />
                    ) : null
                  )}

                  {currentConversation.isStreaming &&
                    index === currentConversation.messages.length - 1 && (
                      <div className="text-gray-400 italic text-xs">
                        <span className="animate-pulse">●</span>{" "}
                        Generating...
                      </div>
                    )}

                  {/* Info button for raw JSON */}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="flex flex-row items-center mb-4 gap-2">
            <div className="flex flex-row items-center gap-2">
              <GeminiIcon />
              <GeminiText />
            </div>
            <span className="text-4xl font-medium gradient-text-desktop">
              Desktop
            </span>
          </div>

          <p className="text-muted-foreground mb-6">
            Your ideas for the future are just a click away.
          </p>

          {/* Dashboard tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {/* Gemini CLI Projects Card */}
            <Card
              className="cursor-pointer transition-colors hover:bg-accent w-full"
              onClick={() => navigate("/projects")}
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="shrink-0 h-6 w-6 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-base">Projects</CardTitle>
                  <CardDescription>Manage your projects, view past discussions.</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card
              className="w-full opacity-60 cursor-not-allowed select-none"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="shrink-0 h-6 w-6 flex items-center justify-center">
                  <ModelContextProtocol className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">MCP Servers</CardTitle>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                      Coming soon
                    </span>
                  </div>
                  <CardDescription>Manage MCP configuration and settings.</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};