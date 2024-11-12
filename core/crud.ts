import fs from "fs"
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

type UUID = string
interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}


function create(content: string, file_path: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content,
        done: false,
    }

    const todos: Array<Todo> = [
        ...read(file_path),
        todo,
    ]

    fs.writeFileSync(file_path, JSON.stringify({
        todos,
    }, null, 2));

    return todo;
}

function read(file_path: string): Array<Todo> {
    const dbString = fs.readFileSync(file_path, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

function CLEAR_DB(file_path: string) {
    fs.writeFileSync(file_path, "");
}

function update(id: UUID, file_path: string, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read(file_path);
    const todoIndex = todos.findIndex(e => e.id === id)

    if (todoIndex === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }

    const existingTodo = todos[todoIndex];

    updatedTodo = Object.assign(existingTodo, partialTodo)

    // Salvar as alterações de volta no arquivo
    fs.writeFileSync(file_path, JSON.stringify({ todos }, null, 2));
    return updatedTodo
}

function updateContentById(id: UUID, file_path: string, content: string): Todo {
    return update(id, file_path, {
        content,
    })
}

function deleteById(id: UUID, file_path: string) {
    const todos = read(file_path);

    const filteredTodos = todos.filter((todo) => (
        id !== todo.id
    ))

    fs.writeFileSync(file_path, JSON.stringify({
        todos: filteredTodos,
    }, null, 2))
}

CLEAR_DB(DB_FILE_PATH);
create("O primeiro conteudo de mesmo content", DB_FILE_PATH);
create("O primeiro conteudo de mesmo content", DB_FILE_PATH);
const terceiraTodo = create("O segundo conteudo", DB_FILE_PATH);
const extraTodo = create("extra extra", DB_FILE_PATH);
deleteById(extraTodo.id, DB_FILE_PATH);
// update(terceiraTodo.id, DB_FILE_PATH, {
//     content: "O segundo conteudo atualizadissimo mlk",
// });
// updateContentById(terceiraTodo.id, DB_FILE_PATH, "Update so do content né")
console.log(read(DB_FILE_PATH));
