import type React from "react";
import { useState } from "react";

const Parent: React.FC = () => {
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>{message}</div>
      <Child setMessage={setMessage} />
    </div>
  );
};

const Child: React.FC<{ setMessage(message: string): void }> = ({
  setMessage,
}) => {
  const [val, setVal] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage(val);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
      />
      <button type="submit">Submit</button>;
    </form>
  );
};
