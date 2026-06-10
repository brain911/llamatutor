"use client";

import React, { ReactNode } from "react";

/**
 * GenerativeUI Component
 * Supports rendering rich, interactive UI components streamed from LLM responses.
 * Can render standard components and custom interactive elements.
 */

export interface GenerativeUIElement {
  type: "text" | "button" | "card" | "list" | "table" | "alert" | "code";
  props?: Record<string, any>;
  children?: ReactNode;
}

interface GenerativeUIProps {
  elements: GenerativeUIElement[];
  onAction?: (action: string, payload?: any) => void;
}

/**
 * Render a button element
 */
const ButtonElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
  onAction?: (action: string) => void;
}> = ({ props, children, onAction }) => {
  const {
    label = "Click me",
    variant = "primary",
    action = "default",
    disabled = false,
  } = props || {};

  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300",
  };

  return (
    <button
      onClick={() => onAction?.(action)}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 font-medium transition-colors ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary} disabled:cursor-not-allowed`}
    >
      {label || children}
    </button>
  );
};

/**
 * Render a card element
 */
const CardElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
}> = ({ props, children }) => {
  const { title, subtitle, variant = "default" } = props || {};

  const variantClasses = {
    default: "border-gray-200 bg-white",
    info: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50",
    warning: "border-amber-200 bg-amber-50",
    error: "border-red-200 bg-red-50",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}`}
    >
      {title && (
        <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
      )}
      {subtitle && (
        <p className="mb-2 text-sm text-gray-600">{subtitle}</p>
      )}
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
};

/**
 * Render a list element
 */
const ListElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
}> = ({ props, children }) => {
  const { items = [], ordered = false } = props || {};

  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`space-y-2 ${ordered ? "list-decimal" : "list-disc"} pl-6`}
    >
      {items.map((item: string, idx: number) => (
        <li key={idx} className="text-gray-800">
          {item}
        </li>
      ))}
      {children}
    </ListTag>
  );
};

/**
 * Render a table element
 */
const TableElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
}> = ({ props, children }) => {
  const { headers = [], rows = [] } = props || {};

  if (headers.length === 0 || rows.length === 0) {
    return <div className="text-gray-600">No table data provided</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {headers.map((header: string, idx: number) => (
              <th
                key={idx}
                className="px-4 py-2 text-left font-semibold text-gray-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any[], rowIdx: number) => (
            <tr key={rowIdx} className="border-b hover:bg-gray-50">
              {row.map((cell: any, cellIdx: number) => (
                <td
                  key={cellIdx}
                  className="px-4 py-2 text-gray-800"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render an alert element
 */
const AlertElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
}> = ({ props, children }) => {
  const { severity = "info", title } = props || {};

  const severityClasses = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      className={`rounded-lg border p-3 ${severityClasses[severity as keyof typeof severityClasses] || severityClasses.info}`}
    >
      {title && (
        <h4 className="mb-1 font-semibold">{title}</h4>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
};

/**
 * Render a code element with enhanced styling
 */
const CodeElement: React.FC<{
  props?: Record<string, any>;
  children?: ReactNode;
}> = ({ props, children }) => {
  const { language = "text", inline = false } = props || {};

  if (inline) {
    return (
      <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800">
        {children}
      </code>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4">
      <code className="font-mono text-sm text-gray-100">
        {children}
      </code>
    </pre>
  );
};

/**
 * Main GenerativeUI component
 */
const GenerativeUI: React.FC<GenerativeUIProps> = ({
  elements,
  onAction,
}) => {
  const renderElement = (
    element: GenerativeUIElement,
    index: number
  ): ReactNode => {
    switch (element.type) {
      case "text":
        return (
          <p key={index} className="text-gray-800">
            {element.children}
          </p>
        );

      case "button":
        return (
          <div key={index} className="mb-2">
            <ButtonElement
              props={element.props}
              onAction={(action) => onAction?.(action, element.props)}
            >
              {element.children}
            </ButtonElement>
          </div>
        );

      case "card":
        return (
          <CardElement key={index} props={element.props}>
            {element.children}
          </CardElement>
        );

      case "list":
        return (
          <ListElement key={index} props={element.props}>
            {element.children}
          </ListElement>
        );

      case "table":
        return (
          <TableElement key={index} props={element.props}>
            {element.children}
          </TableElement>
        );

      case "alert":
        return (
          <AlertElement key={index} props={element.props}>
            {element.children}
          </AlertElement>
        );

      case "code":
        return (
          <CodeElement key={index} props={element.props}>
            {element.children}
          </CodeElement>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {elements.map((element, index) =>
        renderElement(element, index)
      )}
    </div>
  );
};

export default GenerativeUI;
