import { Editor } from "@tinymce/tinymce-react";
import React from "react";

const TinyMCEEditor = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="c2jm79inmod7lmptd7yluiyzj6ovd1ek35a07blb4rnt8ljp"
      value={value}
      init={{
        height: 190,
        menubar: false,
        plugins: "advlist autolink lists link charmap print preview anchor",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | print preview",
      }}
      onEditorChange={onChange}
    />
  );
};

export default TinyMCEEditor;
