import { useState } from "react";


export enum EditableTextState {
  Display,
  Editing,
  Saving,
}

type EditableTextProps = {
  value: string;
  onUpdate: (newValue: string) => Promise<any>;
};

export default function EditableText({ value, onUpdate }: EditableTextProps) {
  const [state, setState] = useState(EditableTextState.Display);

  if (state === EditableTextState.Display) {
    return (
      <span>
        {value}{" "}
        <button onClick={() => setState(EditableTextState.Editing)}>edit</button>
      </span>
    );
  }

  return (
    <form>
      <input name="text" defaultValue={value} autoFocus />
      <button type="submit">Save</button>
      <button type="button" onClick={() => setState(EditableTextState.Display)}>
        Cancel
      </button>
    </form>
  );
}

