"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createLink, updateLink, deleteLink, toggleLink, reorderLinks } from "@/app/actions/links";
import type { Database } from "@/types/database";

type Link = Database["public"]["Tables"]["links"]["Row"];

function SortableLink({
  link,
  onEdit,
}: {
  link: Link;
  onEdit: (link: Link) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleToggle(checked: boolean) {
    await toggleLink(link.id, checked);
  }

  async function handleDelete() {
    if (confirm(`「${link.title}」を削除しますか？`)) {
      await deleteLink(link.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 group"
    >
      <button
        className="cursor-grab text-gray-400 hover:text-gray-600 flex-shrink-0 touch-none"
        {...attributes}
        {...listeners}
        aria-label="並べ替え"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
        <p className="text-xs text-gray-400 truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Switch
          checked={link.is_active}
          onCheckedChange={handleToggle}
          aria-label="表示/非表示"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900"
          onClick={() => onEdit(link)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
          onClick={handleDelete}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

function EditModal({
  link,
  onClose,
}: {
  link: Link;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateLink(link.id, formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">リンクを編集</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">タイトル</label>
            <Input name="title" defaultValue={link.title} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">URL</label>
            <Input name="url" type="url" defaultValue={link.url} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>キャンセル</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LinkList({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex);
      setLinks(reordered);
      await reorderLinks(reordered.map((l) => l.id));
    },
    [links]
  );

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createLink(formData);
    if (result?.error) {
      setAddError(result.error);
      setAddLoading(false);
    } else {
      (e.target as HTMLFormElement).reset();
      setShowAdd(false);
      setAddLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {links.length === 0 && !showAdd && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">まだリンクがありません</p>
          <p className="text-xs mt-1">下の「リンクを追加」ボタンから追加してください</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableLink key={link.id} link={link} onEdit={setEditingLink} />
          ))}
        </SortableContext>
      </DndContext>

      {showAdd ? (
        <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">タイトル</label>
            <Input name="title" placeholder="例：最新ブログ記事" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">URL</label>
            <Input name="url" type="url" placeholder="https://" required />
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={addLoading}>
              {addLoading ? "追加中..." : "追加"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddError(""); }}>
              キャンセル
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setShowAdd(true)}
          className="w-full border-dashed"
          variant="outline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          リンクを追加
        </Button>
      )}

      {editingLink && (
        <EditModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
        />
      )}
    </div>
  );
}
