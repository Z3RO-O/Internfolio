'use client';
import React from 'react';
import { FormData, Project } from '@/types';
import Link from 'next/link';
import PDFExportButton from '@/components/internship-report/button';
import { trackEvent } from '@/lib/mixpanel';

interface ModernTemplateProps {
  data: FormData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const { basicInfo, techStack, projects, learning } = data;

  return (
    <div className="w-full min-h-screen font-inter bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with gradient */}
      <nav className="flex justify-between items-center px-6 py-6 md:px-12 md:py-8 backdrop-blur-sm bg-white/70 border-b border-gray-200/50">
        <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Internfolio
        </div>
        <div className="flex space-x-3">
          <PDFExportButton data={data} />
          <Link
            href="/"
            onClick={() =>
              trackEvent('get_your_clicked', {
                category: 'Portfolio Button',
                label: 'get_your_clicked'
              })
            }
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 no-underline">
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Basic Info */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              {basicInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-4">
              {basicInfo.internshipRole || 'Intern Role'}
            </p>
            <p className="text-xl text-gray-600 font-medium mb-8">
              {basicInfo.teamDepartment || 'Team / Department'}
            </p>
          </div>

          {basicInfo.summary && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {basicInfo.summary}
              </p>
            </div>
          )}

          {(basicInfo.startDate || basicInfo.endDate) && (
            <div className="flex justify-center gap-6 mt-8">
              {basicInfo.startDate && (
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50">
                  <span className="text-sm text-gray-500 font-medium">Start:</span>
                  <span className="ml-2 text-gray-900 font-bold">{basicInfo.startDate}</span>
                </div>
              )}
              {basicInfo.endDate && (
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50">
                  <span className="text-sm text-gray-500 font-medium">End:</span>
                  <span className="ml-2 text-gray-900 font-bold">{basicInfo.endDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
            Impact Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-xl text-white transform transition-all hover:scale-105">
              <div className="text-5xl font-black mb-2">{projects.length}</div>
              <div className="text-xl font-semibold opacity-90">Projects</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-8 shadow-xl text-white transform transition-all hover:scale-105">
              <div className="text-5xl font-black mb-2">
                {techStack.languages.length + techStack.frameworks.length + techStack.tools.length}
              </div>
              <div className="text-xl font-semibold opacity-90">Technologies</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white transform transition-all hover:scale-105">
              <div className="text-5xl font-black mb-2">
                {projects.reduce((acc, p) => acc + (p.pullRequests?.length || 0), 0)}
              </div>
              <div className="text-xl font-semibold opacity-90">Contributions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {(techStack.languages.length > 0 ||
        techStack.frameworks.length > 0 ||
        techStack.tools.length > 0) && (
        <section className="px-6 py-16 md:px-12 md:py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
              Tech Stack
            </h2>
            <div className="space-y-8">
              {techStack.languages.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {techStack.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 px-6 py-3 rounded-2xl font-semibold text-lg shadow-md border border-blue-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {techStack.frameworks.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Frameworks</h3>
                  <div className="flex flex-wrap gap-3">
                    {techStack.frameworks.map((framework, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 px-6 py-3 rounded-2xl font-semibold text-lg shadow-md border border-indigo-200">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {techStack.tools.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Tools</h3>
                  <div className="flex flex-wrap gap-3">
                    {techStack.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 px-6 py-3 rounded-2xl font-semibold text-lg shadow-md border border-purple-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="px-6 py-16 md:px-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
              Projects
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project: Project, idx: number) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <h3 className="text-3xl font-black text-gray-900 mb-4">{project.title}</h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {project.role && (
                    <div className="mb-6">
                      <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 px-4 py-2 rounded-xl font-semibold">
                        {project.role}
                      </span>
                    </div>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIdx) => (
                          <span
                            key={techIdx}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl font-medium text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.outcome && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-2">Outcome</h4>
                      <p className="text-gray-700">{project.outcome}</p>
                    </div>
                  )}

                  {project.pullRequests && project.pullRequests.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Pull Requests</h4>
                      <div className="space-y-2">
                        {project.pullRequests.map((pr, prIdx) => (
                          <div
                            key={prIdx}
                            className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">{pr.title}</span>
                              <span
                                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                  pr.status === 'Merged'
                                    ? 'bg-purple-100 text-purple-800'
                                    : pr.status === 'Open'
                                      ? 'bg-green-100 text-green-800'
                                      : pr.status === 'Draft'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                {pr.status}
                              </span>
                            </div>
                            {pr.description && (
                              <p className="text-gray-600 text-sm mt-2">{pr.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learning & Growth */}
      {(learning.currentlyLearning.length > 0 || learning.interestedIn.length > 0) && (
        <section className="px-6 py-16 md:px-12 md:py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
              Learning & Growth
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learning.currentlyLearning.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Currently Learning</h3>
                  <ul className="space-y-3">
                    {learning.currentlyLearning.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 text-lg">
                        <span className="text-blue-600 font-black text-xl">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {learning.interestedIn.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Interested In</h3>
                  <ul className="space-y-3">
                    {learning.interestedIn.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 text-lg">
                        <span className="text-indigo-600 font-black text-xl">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="flex flex-col gap-6 justify-center items-center px-6 py-16 md:px-12 md:py-20">
        <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
          Created with Internfolio
        </div>
        <div className="flex space-x-3">
          <PDFExportButton place={'footer'} data={data} />
          <Link
            href="/"
            onClick={() => {
              trackEvent('create_new_clicked', {
                category: 'Portfolio Button',
                label: 'create_new_clicked'
              });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 no-underline">
            Create Yours
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}

