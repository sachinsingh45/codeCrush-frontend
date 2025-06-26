import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import duotoneLight from "prism-react-renderer/themes/duotoneLight";
import { toast } from "react-toastify";
import MarkdownWithHighlight from "./MarkdownWithHighlight";

const CodeReviewPage = () => {
  const user = useSelector((store) => store.user);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    tags: "",
    language: "javascript",
  });
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [filter, setFilter] = useState("all"); // 'all', 'mine'
  const navigate = useNavigate();
  // Detect theme
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "abyss"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch all snippets
  const fetchSnippets = async (sortOption = sort) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${BASE_URL}/code-review/snippet/all?sort=${sortOption}`
      );
      setSnippets(res.data.snippets || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load snippets";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets(sort);
    // eslint-disable-next-line
  }, [sort]);

  // Fetch snippet details
  const fetchSnippetDetails = async (id) => {
    setSelectedSnippet(null);
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/code-review/snippet/${id}`);
      setSelectedSnippet(res.data.snippet);
      setAiSummary(res.data.snippet.aiSummary);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load snippet");
    } finally {
      setLoading(false);
    }
  };

  // Submit new snippet
  const handleSubmitSnippet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await axios.post(`${BASE_URL}/code-review/snippet`, payload, {
        withCredentials: true,
      });
      setForm({ code: "", description: "", tags: "", language: "javascript" });
      setShowForm(false);
      fetchSnippets();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit snippet");
    } finally {
      setLoading(false);
    }
  };

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/code-review/snippet/${selectedSnippet._id}/review`,
        { review: reviewText },
        { withCredentials: true }
      );
      setReviewText("");
      fetchSnippetDetails(selectedSnippet._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  // Upvote review
  const handleUpvote = async (reviewId) => {
    setReviewLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/code-review/review/${reviewId}/upvote`,
        {},
        { withCredentials: true }
      );
      fetchSnippetDetails(selectedSnippet._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upvote");
    } finally {
      setReviewLoading(false);
    }
  };

  // Generate AI summary
  const handleAISummary = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/code-review/snippet/${selectedSnippet._id}/ai-summary`,
        {},
        { withCredentials: true }
      );
      setAiSummary(res.data.summary);
      fetchSnippetDetails(selectedSnippet._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate summary");
    } finally {
      setAiLoading(false);
    }
  };

  // Upvote snippet
  const handleUpvoteSnippet = async (snippetId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/code-review/snippet/${snippetId}/upvote`,
        {},
        { withCredentials: true }
      );
      fetchSnippets(sort);
      toast.success(res.data.message);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upvote snippet");
    } finally {
      setLoading(false);
    }
  };

  // Filtered snippets based on filter
  const filteredSnippets = snippets.filter((snippet) => {
    if (filter === "mine") {
      return snippet.author?._id === user?._id;
    }
    return true;
  });

  // Only keep this useEffect for API errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-base-content">Code Review</h1>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Submit Snippet"}
          </button>
        )}
      </div>
      {/* Modern control bar for sort and filter */}
      {!showForm && (
        <div className="card bg-base-100/80 dark:bg-base-200/80 border border-base-200 dark:border-base-300 shadow-lg mb-6 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-semibold text-base-content mr-2">Sort:</span>
            <button
              className={`btn btn-xs md:btn-sm rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${
                sort === "top"
                  ? "btn-primary text-primary-content"
                  : "btn-ghost text-base-content"
              }`}
              onClick={() => setSort("top")}
            >
              Top
            </button>
            <button
              className={`btn btn-xs md:btn-sm rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${
                sort === "recent"
                  ? "btn-primary text-primary-content"
                  : "btn-ghost text-base-content"
              }`}
              onClick={() => setSort("recent")}
            >
              Recent
            </button>
            <button
              className={`btn btn-xs md:btn-sm rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${
                sort === "oldest"
                  ? "btn-primary text-primary-content"
                  : "btn-ghost text-base-content"
              }`}
              onClick={() => setSort("oldest")}
            >
              Oldest
            </button>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-semibold text-base-content mr-2">
              Filter:
            </span>
            <button
              className={`btn btn-xs md:btn-sm rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${
                filter === "all"
                  ? "btn-accent text-accent-content"
                  : "btn-ghost text-base-content"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn btn-xs md:btn-sm rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${
                filter === "mine"
                  ? "btn-accent text-accent-content"
                  : "btn-ghost text-base-content"
              }`}
              onClick={() => setFilter("mine")}
            >
              My Requested
            </button>
          </div>
        </div>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmitSnippet}
          className="mb-8 card bg-base-100 p-6 shadow-xl border border-base-200 rounded-2xl"
        >
          <textarea
            className="textarea textarea-bordered w-full mb-3"
            rows={6}
            placeholder="Paste your code here..."
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <input
            className="input input-bordered w-full mb-3"
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="input input-bordered w-full mb-3"
            placeholder="Tags (comma separated, e.g. javascript,react,api)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <select
            className="select select-bordered w-full mb-3"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            required
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="rust">Rust</option>
            <option value="scala">Scala</option>
            <option value="other">Other</option>
          </select>
          <button
            className="btn btn-success self-end"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : "Submit"}
          </button>
        </form>
      )}
      {loading && !showForm && !selectedSnippet && (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spinner size={40} />
        </div>
      )}
      {filteredSnippets.length === 0 ? (
        <div className="text-center text-base-content mt-10 text-lg font-semibold">
          No code reviews found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet._id}
              className="card bg-base-100 shadow-xl border border-base-200 rounded-2xl p-4 cursor-pointer hover:scale-[1.03] hover:shadow-2xl transition-all"
              onClick={() => navigate(`/code-review/${snippet._id}`)}
            >
              <div className="flex items-center gap-2 mb-1">
                {snippet.language && (
                  <span className="badge badge-accent badge-outline text-xs">
                    {snippet.language}
                  </span>
                )}
              </div>
              <Highlight
                {...defaultProps}
                code={snippet.code}
                language={snippet.language || "javascript"}
                theme={theme === "lemonade" ? duotoneLight : dracula}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <pre
                    className={
                      className +
                      " rounded p-2 text-xs overflow-x-auto max-h-32 mb-2 bg-base-200 border border-base-300"
                    }
                    style={style}
                  >
                    {tokens.map((line, i) => {
                      const { key, ...rest } = getLineProps({ line, key: i });
                      return (
                        <div key={key} {...rest}>
                          {line.map((token, key) => {
                            const { key: spanKey, ...spanProps } =
                              getTokenProps({ token, key });
                            return <span key={spanKey} {...spanProps} />;
                          })}
                        </div>
                      );
                    })}
                  </pre>
                )}
              </Highlight>
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {snippet.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-primary text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-base-content font-semibold mb-1">
                {snippet.description}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {snippet.author?.photoUrl && (
                  <img
                    src={snippet.author.photoUrl}
                    alt={snippet.author.firstName}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/users/${snippet.author._id}`);
                    }}
                  />
                )}
                <span
                  className="text-xs font-semibold text-base-content cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/${snippet.author._id}`);
                  }}
                >
                  {snippet.author?.firstName} {snippet.author?.lastName}
                </span>
                <span className="text-xs text-base-content ml-auto">
                  {new Date(snippet.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-secondary font-bold">
                  Upvotes: {snippet.upvotes || 0}
                </span>
                {user && (
                  <button
                    className={`btn btn-xs ${
                      snippet.upvotedBy && snippet.upvotedBy.includes(user._id)
                        ? "btn-success"
                        : "btn-secondary btn-outline"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvoteSnippet(snippet._id);
                    }}
                    disabled={loading}
                  >
                    {snippet.upvotedBy && snippet.upvotedBy.includes(user._id)
                      ? "👍 Un-upvote"
                      : "👍 Upvote"}
                  </button>
                )}
              </div>
              {snippet.aiSummaryGenerated && (
                <div className="badge badge-info mt-2">
                  AI Summary Available
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeReviewPage;
