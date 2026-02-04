'use client';

// Single todo item with checkbox and delete button

export default function TodoItem({ todo, onToggle, onDelete }) {
    const done = todo.status === 'completed';

    return (
        <div className="flex items-center gap-3 p-3 bg-white border rounded mb-2">
            {/* Checkbox to toggle status */}
            <input
                type="checkbox"
                checked={done}
                onChange={() => onToggle(todo.id, todo.status)}
                className="w-5 h-5"
            />

            {/* Todo title - strikethrough if completed */}
            <span className={`flex-1 ${done ? 'line-through text-gray-400' : ''}`}>
                {todo.title}
            </span>

            {/* Delete button */}
            <button
                onClick={() => onDelete(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
            >
                Delete
            </button>
        </div>
    );
}
