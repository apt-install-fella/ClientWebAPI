import { useState } from "react";

export const EditableTextState = {
  Display: 0,
  Editing: 1,
  Saving: 2,
} as const;

export type EditableTextState =
  (typeof EditableTextState)[keyof typeof EditableTextState];

type EditableTextProps = {
  value: string;
  onSave: (newValue: string) => Promise<any>;
};

export default function EditableText({ value, onSave }: EditableTextProps) {
  const [state, setState] = useState<EditableTextState>(
    EditableTextState.Display,
  );

  if (state === EditableTextState.Display) {
    return (
      <span>
        {value}{" "}
        <button onClick={() => setState(EditableTextState.Editing)}>
          ✍
          </button>
      </span>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const newValue = (form.elements.namedItem("text") as HTMLInputElement)
      .value;

    setState(EditableTextState.Saving);
    await onSave(newValue);
    setState(EditableTextState.Display);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="text" defaultValue={value} autoFocus />
      <button type="submit">Save</button>
      <button type="button" onClick={() => setState(EditableTextState.Display)}>
        Cancel
      </button>
    </form>
  );
}
