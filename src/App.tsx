import React, { useState, useEffect } from 'react';
import { Memo } from './types';
import { MemoList } from './components/MemoList';
import { MemoForm } from './components/MemoForm';
import { PlusCircle, StickyNote } from 'lucide-react';

function App() {
  const [memos, setMemos] = useState<Memo[]>(() => {
    try {
      const saved = localStorage.getItem('memos');
      if (saved) {
        return JSON.parse(saved, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.error('Failed to load memos:', error);
    }
    return [];
  });

  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (error) {
      console.error('Failed to save memos:', error);
    }
  }, [memos]);

  const handleSave = (memoData: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMemo) {
      setMemos(prevMemos => 
        prevMemos.map(memo =>
          memo.id === editingMemo.id
            ? { ...memo, ...memoData, updatedAt: new Date() }
            : memo
        )
      );
    } else {
      const newMemo: Memo = {
        ...memoData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMemos(prevMemos => [newMemo, ...prevMemos]);
    }
    setEditingMemo(null);
    setIsFormVisible(false);
  };

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('本当にこのメモを削除しますか？')) {
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingMemo(null);
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">メモアプリ</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              新規メモ
            </button>
          </div>
        </header>

        {isFormVisible && (
          <div className="mb-8 transition-all duration-200 ease-in-out">
            <MemoForm
              key={editingMemo?.id || 'new'}
              memo={editingMemo}
              onSave={handleSave}
              onCancel={() => {
                setIsFormVisible(false);
                setEditingMemo(null);
              }}
            />
          </div>
        )}

        <div className="transition-all duration-200 ease-in-out">
          {memos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <StickyNote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">メモがありません。新規メモを作成してください。</p>
            </div>
          ) : (
            <MemoList
              memos={memos}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;