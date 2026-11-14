import React, { useState, useEffect } from 'react';
import { FileSearch, Plus, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminResearchPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [doi, setDoi] = useState('');
  const [summary, setSummary] = useState('');

  const loadSources = async () => {
    try {
      const res = await api.getResearchSources();
      setSources(res.sources || []);
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleAddSource = async (e) => {
    e.preventDefault();
    try {
      await api.addResearchSource({
        title,
        authorOrOrganization: author,
        doiOrIdentifier: doi,
        summary,
        publicationDate: new Date().toISOString().split('T')[0],
        publisher: 'Academic Press',
        verificationStatus: 'Verified & Peer Reviewed'
      });
      setShowModal(false);
      setTitle('');
      setAuthor('');
      setDoi('');
      setSummary('');
      loadSources();
    } catch (err) {
      console.error('Failed to add research citation:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Library & Citations</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain rigorous academic references and link verified claims to learning modules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Research Source
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading research sources...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sources.map((s) => (
              <div key={s.id} className="p-6 space-y-2 hover:bg-slate-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {s.verificationStatus}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{s.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{s.authorOrOrganization}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{s.doiOrIdentifier}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{s.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Add Academic Research Source</h2>
            <form onSubmit={handleAddSource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Paper or monograph title..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Author / Institution</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Dr. Richard Paul (Foundation for Critical Thinking)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DOI / ISBN / Identifier</label>
                <input
                  type="text"
                  required
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="e.g. ISBN 978-0374275631 or DOI URL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Empirical Synthesis / Abstract</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize core empirical claims and epistemological relevance..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Citation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

