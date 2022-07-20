import { Todo } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

const TodoItem: React.FC<{
  todo: Todo;
}> = ({ todo }) => {
  const mutation = trpc.useMutation(["todo.update-todo"]);

  const onChange = () => {
    todo.done = !todo.done;
    mutation.mutate({ ...todo });
  };

  return (
    <div
      key={todo.id}
      className="flex gap-2 rounded bg-gray-700 p-4 md:w-1/2 w-full"
    >
      <input type="checkbox" checked={todo.done} onChange={onChange}></input>
      <span className={classNames({ "line-through": todo.done })}>
        {todo.text}
      </span>
    </div>
  );
};

const CreateTodoForm: React.FC = () => {
  const utils = trpc.useContext();

  const mutation = trpc.useMutation(["todo.create-todo"], {
    onSuccess() {
      utils.invalidateQueries(["todo.get-todos"]);
    },
  });
  const [text, setText] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    mutation.mutate({ text });
    setText("");
  };

  return (
    <form className="flex md:w-1/2 w-full" onSubmit={onSubmit}>
      <input
        className="p-4 flex-1 rounded text-black focus:outline-0"
        type="text"
        placeholder="Enter a new todo..."
        onChange={onChange}
        value={text}
      />
      <button className="p-4 rounded bg-gray-600" type="submit">
        Submit
      </button>
    </form>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["todo.get-todos"]);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data]);

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Todos</title>
        <meta name="description" content="Just another todo list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col p-8 gap-8 items-center">
        <h1 className="text-2xl capitalize">Todo List</h1>
        <CreateTodoForm />
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </>
  );
};

export default Home;
