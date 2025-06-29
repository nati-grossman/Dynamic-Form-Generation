/**
 * DynamicForm Field Renderer - Main renderer component
 *
 * This module handles routing to appropriate field renderers based on field type.
 * Each field type has its own dedicated renderer component.
 */

import React from "react";
import { FieldRendererProps } from "./types";
import {
  TextFieldRenderer,
  DateFieldRenderer,
  NumberFieldRenderer,
  SelectFieldRenderer,
} from "./renderers/rendererExports";

/**
 * Main field renderer component
 * Routes to appropriate renderer based on field type
 */
export const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const { field } = props;

  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return <TextFieldRenderer {...props} />;
    case "date":
      return <DateFieldRenderer {...props} />;
    case "number":
      return <NumberFieldRenderer {...props} />;
    case "dropdown":
      return <SelectFieldRenderer {...props} />;
    default:
      return null;
  }
};
