'use client';

// Single todo item with checkbox and delete button

export default function TodoItem({ todo, onToggle, onDelete }) {
    const done = todo.status === 'completed';

    return (
        <div className="flex items-center gap-4 p-4 bg-white border-2 border-black group">
            {/* Custom Checkbox */}
            <input
                type="checkbox"
                checked={done}
                onChange={() => onToggle(todo.id, todo.status)}
                className="w-6 h-6 border-2 border-black rounded-none appearance-none checked:bg-black checked:border-black cursor-pointer relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[6px] after:top-[2px] after:w-2 after:h-4 after:border-white after:border-b-2 after:border-r-2 after:rotate-45"
            />

            {/* Todo title */}
            <span className={`flex-1 font-bold tracking-tight text-lg ${done ? 'line-through text-black/30 decoration-2' : 'text-black'}`}>
                {todo.title}
            </span>

            {/* Delete button */}
            <button
                onClick={() => onDelete(todo.id)}
                className="text-[10px] uppercase font-black tracking-widest text-black/20 hover:text-red-600 transition-colors"
            >
                [ DELETE ]
            </button>
        </div>
    );
}
