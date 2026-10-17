import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Newspaper, User } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

export function V2Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col items-center justify-between gap-4 border-b border-gold/20 pb-6 sm:flex-row">
              <div className="flex items-center space-x-4">
                <Newspaper className="text-gold" size={32} />
                <div>
                  <h1 className="font-display text-3xl font-bold italic tracking-wide text-gold magic-shadow">
                    Crónicas Arcanas
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-parchment/35">
                    Relatos de la vanguardia médica
                  </p>
                </div>
              </div>
              <p className="font-magic text-sm italic text-gold-dim">
                {BLOG_POSTS.length} crónicas en el archivo
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.title}
                  className="group grid grid-cols-1 gap-6 border-l-2 border-gold/10 pl-6 transition-all hover:border-gold md:grid-cols-3"
                >
                  <div
                    onClick={() => setSelectedPost(post)}
                    className="relative h-48 cursor-pointer overflow-hidden rounded-lg md:h-full"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 to-transparent" />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest text-medical-teal">
                        <span>{post.category}</span>
                        <span className="h-1 w-1 rounded-full bg-medical-teal/30" />
                        <div className="flex items-center space-x-1">
                          <Calendar size={10} />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <h2
                        onClick={() => setSelectedPost(post)}
                        className="cursor-pointer font-display text-2xl font-bold text-gold transition-colors group-hover:text-parchment"
                      >
                        {post.title}
                      </h2>
                    </div>
                    <p className="font-sans italic leading-relaxed text-parchment/60">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs text-gold/40">
                        <User size={12} />
                        <span>{post.author}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gold transition-colors hover:text-medical-teal"
                      >
                        <span>Leer más</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-4xl space-y-8"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gold-dim transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              <span>Volver a las Crónicas</span>
            </button>

            <div className="space-y-6">
              <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gold/20 sm:h-96">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="h-full w-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.3em] text-medical-teal">
                  <span>{selectedPost.category}</span>
                  <span className="h-1 w-1 rounded-full bg-medical-teal/30" />
                  <span>{selectedPost.date}</span>
                </div>
                <h2 className="font-display text-4xl font-bold leading-tight text-gold magic-shadow sm:text-5xl">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center space-x-3 border-b border-gold/10 pb-6 text-sm italic text-gold/40">
                  <User size={16} />
                  <span>Por {selectedPost.author}</span>
                </div>
              </div>
            </div>

            <p className="whitespace-pre-line font-sans text-xl italic leading-relaxed text-parchment first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-gold">
              {selectedPost.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
