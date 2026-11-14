import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2, Search, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function ResearchPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchSources() {
      try {
        const res = await api.getResearchSources();
        setSources(res.sources || []);
      } catch (err) {
        console.error('Failed to load research sources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(filter.toLowerCase()) ||
    s.authorOrOrganization.toLowerCase().includes(filter.toLowerCase()) ||
    s.summary.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          Evidence-Led Pedagogical Framework
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Research Backing & Source Traceability
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          At EduVerse, we reject unverified educational fads. Every course module is anchored in peer-reviewed cognitive psychology, statistical methodology, and established epistemological principles.
        </p>
      </div>

      {/* Research Workflow 4-Step Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-white rounded-2xl border border-slate-200">
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
          <h3 className="font-bold text-slate-900 text-sm">Empirical Discovery</h3>
          <p className="text-xs text-slate-500">Collect foundational academic papers, peer-reviewed monographs, and experimental trials.</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
          <h3 className="font-bold text-slate-900 text-sm">Credibility Audit</h3>
          <p className="text-xs text-slate-500">Evaluate methodology, sample size limitations, replication status, and cognitive biases.</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
          <h3 className="font-bold text-slate-900 text-sm">Original Synthesis</h3>
          <p className="text-xs text-slate-500">Distill complex theories into structured, high-clarity lesson blocks and worked examples.</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">4</div>
          <h3 className="font-bold text-slate-900 text-sm">Peer Review & Citation</h3>
          <p className="text-xs text-slate-500">Link verified citations directly within each lesson reading interface for full learner auditability.</p>
        </div>
      </div>

      {/* Sources Directory */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Research Citations</h2>
            <p className="text-xs text-slate-500 mt-1">Review the foundational texts currently informing EduVerse modules</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search citations..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading research index...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSources.map((source) => (
              <div key={source.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      ✓ {source.verificationStatus}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-2">{source.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{source.authorOrOrganization}</p>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600"
                      title="Inspect original source"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {source.summary}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap justify-between gap-2">
                  <span><strong>Published:</strong> {source.publicationDate} ({source.publisher})</span>
                  <span><strong>Identifier:</strong> {source.doiOrIdentifier}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

