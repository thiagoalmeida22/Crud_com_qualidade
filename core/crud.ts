import fs from "fs"
import { Interface } from "readline";
const DB_FILE_PATH = "./core/db";
interface Todo {
    date: string;
    content: string;
    done: boolean;
}


function create(content: string, file_path: string) {
    const todo: Todo = {
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

CLEAR_DB(DB_FILE_PATH);
create("O primeiro conteudo", DB_FILE_PATH);
create("O segundo conteudo", DB_FILE_PATH);
console.log(read(DB_FILE_PATH));
