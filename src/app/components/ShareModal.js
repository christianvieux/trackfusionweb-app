import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "@heroui/react";
import { Check, Copy, Link as LinkIcon, Share2 } from "lucide-react";

export default function ShareModal({
  visible = false,
  setVisible,
  url,
  title = "Share",
  description,
  className = "",
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  async function handleCopy() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  function handleClose() {
    setCopied(false);
    setVisible(false);
  }

  function handleOpenChange(nextVisible) {
    if (!nextVisible) setCopied(false);
    setVisible(nextVisible);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <Modal.Backdrop
      isOpen={visible}
      onOpenChange={handleOpenChange}
      className="bg-backdrop"
    >
      <Modal.Container>
        <Modal.Dialog
          className={`border-accent bg-surface text-surface-foreground shadow-card rounded-2xl border-2 ${className}`}
        >
          <Modal.CloseTrigger
            className="bg-muted text-foreground"
            onPress={handleClose}
          >
            ×
          </Modal.CloseTrigger>

          <Modal.Header className="text-primary flex items-center gap-2 px-6 pb-2">
            <Share2 className="size-5" />
            <Modal.Heading className="text-lg font-semibold">
              {title}
            </Modal.Heading>
          </Modal.Header>

          <Modal.Body className="">
            {description && (
              <p className="text-muted-foreground mb-4 text-sm">
                {description}
              </p>
            )}

            <div className="space-y-3">
              <div className="flex w-full items-center gap-2">
                <div className="bg-muted flex-1 overflow-hidden rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="text-primary size-4 shrink-0" />

                    <p className="text-foreground truncate text-sm">{url}</p>
                  </div>
                </div>

                <Button
                  isIconOnly
                  variant="flat"
                  aria-label={copied ? "Copied" : "Copy link"}
                  className="text-primary"
                  onPress={handleCopy}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              <p className="text-muted-foreground pl-1 text-xs">
                Anyone with this link can view this content
              </p>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
