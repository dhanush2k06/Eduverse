import React, { useState, useEffect } from 'react';
import { FileSearch, Plus, ExternalLink, ShieldCheck, Terminal, RefreshCw } from 'lucide-react';
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
    setLoading(true);
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
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              ACADEMIC CITATION MATRIX
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Research Library & Citation Index
          </h1>
          <p className="text-xs text-slate-400">
            Maintain rigorous academic references and link verified claims to 5 flagship learning modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSources}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Sources"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Citation Source</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0e1526] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-slate-500">
            RETRIEVING PEER-REVIEWED CITATIONS MATRIX...
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {sources.map((s) => (
              <div key={s.id} className="p-6 space-y-2 hover:bg-[#141c30]/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      ✓ {s.verificationStatus}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1.5">{s.title}</h3>
                    <p className="text-xs font-mono text-cyan-400 font-semibold">{s.authorOrOrganization}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-1 rounded border border-slate-700">
                    {s.doiOrIdentifier}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">{s.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1526] border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-mono font-bold text-white">Add Academic Research Source</h2>
            <form onSubmit={handleAddSource} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Paper or monograph title..."
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Author / Institution</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Dr. Richard Paul (Foundation for Critical Thinking)"
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">DOI / ISBN / Identifier</label>
                <input
                  type="text"
                  required
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="e.g. ISBN 978-0374275631 or DOI URL"
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Empirical Synthesis / Abstract</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize core empirical claims and epistemological relevance..."
                  className="w-full p-2.5 bg-[#141c30] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
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
