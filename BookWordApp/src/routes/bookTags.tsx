import { useEffect, useState } from "react";
import {
  get_tags_of_book,
  get_all_tags,
  add_tag_to_book,
  remove_tag_from_book,
  create_tag,
} from "../api";
import type { Tag } from "../types";

export default function BookTags({ bookId }: { bookId: number }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingAllTags, setLoadingAllTags] = useState(true);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");

  // Charger les tags du livre
  async function loadTags() {
    setLoadingTags(true);
    try {
      const data = await get_tags_of_book(bookId);
      setTags(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoadingTags(false);
  }

  // Charger tous les tags (une seule fois)
  async function loadAllTags() {
    setLoadingAllTags(true);
    try {
      const data = await get_all_tags();
      setAllTags(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoadingAllTags(false);
  }

  // Charger tags du livre à chaque changement de bookId
  useEffect(() => {
    loadTags();
  }, [bookId]);

  // Charger tous les tags une seule fois
  useEffect(() => {
    loadAllTags();
  }, []);

  // Ajouter un tag
  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTagId) return; // aucun tag choisi

    if (tags.some((t) => t.name === newTagName)) {
      setError("Tag déjà présent");
      return;
    }

    try {
      await add_tag_to_book(bookId, Number(selectedTagId));
      setSelectedTagId("");
      await loadTags();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Supprimer un tag
  async function handleRemoveTag(tagId: number) {
    try {
      await remove_tag_from_book(bookId, tagId);
      await loadTags();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Creer un tag
  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName) return;

    try {
      const newTag = await create_tag(newTagName);

      // ajouter directement au livre
      await add_tag_to_book(bookId, newTag.id);

      setNewTagName("");

      await loadAllTags(); // refresh liste
      await loadTags(); // refresh tags du livre
      
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h3>Tags</h3>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddTag}>
        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
        >
          <option value="">-- Choisir un tag --</option>
          {!loadingAllTags &&
            allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>

        <button type="submit">Ajouter</button>
      </form>

      {error && <p>{error}</p>}

      {/* Liste des tags */}
      {loadingTags ? (
        <p>Loading tags...</p>
      ) : (
        <div>
          {tags.map((tag) => (
            <span key={tag.id} className="badge">
              {tag.name}
              <button onClick={() => handleRemoveTag(tag.id)}>x</button>
            </span>
          ))}
        </div>
      )}

      {/* Création de tag */}
      <form onSubmit={handleCreateTag}>
        <input
          type="text"
          placeholder="Nouveau tag"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
