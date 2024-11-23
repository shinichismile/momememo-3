import React from 'react';
import { Memo } from '../types';
import { Edit2, Trash2, Clock } from 'lucide-react';

interface MemoListProps {
  memos: Memo[];
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
}

export function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <div
          key={memo.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 ease-in-out"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{memo.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(memo)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                aria-label="編集"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(memo.id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                aria-label="削除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap mb-3">{memo.content}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <time dateTime={memo.updatedAt.toISOString()}>
              {memo.updatedAt.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}