import { Editor } from "@tinymce/tinymce-react";
import React from "react";

const TinyMCEEditor = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="c2jm79inmod7lmptd7yluiyzj6ovd1ek35a07blb4rnt8ljp" // Chỉ cần khai báo 1 lần
      value={value}
      init={{
        height: 220,
        menubar: false,
        plugins: "advlist autolink lists link charmap print preview anchor",
        toolbar: "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
      }}
      onEditorChange={onChange} // Gọi hàm callback để cập nhật state
    />
  );
};

export default TinyMCEEditor;
