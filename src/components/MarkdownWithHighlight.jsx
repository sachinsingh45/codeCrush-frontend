import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownWithHighlight({ content }) {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const codeRef = useRef(null);
          const [copied, setCopied] = useState(false);
          const handleCopy = () => {
            if (codeRef.current) {
              navigator.clipboard.writeText(codeRef.current.innerText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          };
          // Remove key from props if present
          const { key, ...restProps } = props;
          return !inline ? (
            <div className="my-2">
              <div className="relative">
                <pre ref={codeRef} className={"rounded p-3 text-xs overflow-x-auto mb-2 bg-base-200 border border-base-300 font-mono text-base-content" + (className ? ` ${className}` : "") }>
                  <code {...restProps}>{children}</code>
                </pre>
                {/* Absolute button for md+ screens */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hidden md:block absolute top-2 right-2 btn btn-xs btn-outline z-10"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                {/* Copied message for desktop, positioned below button */}
                {copied && (
                  <span className="hidden md:block absolute top-10 right-2 text-xs text-success font-semibold bg-base-100 px-2 py-1 rounded shadow z-20 transition-opacity duration-200">Copied!</span>
                )}
              </div>
              {/* Static button for mobile screens */}
              <button
                type="button"
                onClick={handleCopy}
                className="block md:hidden btn btn-xs btn-outline w-full mt-2"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              {/* Copied message for mobile, below button */}
              {copied && (
                <span className="block md:hidden text-xs text-success font-semibold bg-base-100 px-2 py-1 rounded shadow mt-1 w-full text-center transition-opacity duration-200">Copied!</span>
              )}
            </div>
          ) : (
            <code className={className + " bg-base-200 rounded px-1 text-base-content"} {...restProps}>{children}</code>
          );
        }
      }}
    />
  );
}

export default MarkdownWithHighlight; 