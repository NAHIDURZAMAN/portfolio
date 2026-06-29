import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import HeroSection from '../components/HeroSection'
import SkillsSection from '../components/SkillsSection'
import ProjectsSection from '../components/ProjectsSection'
import ExperienceSection from '../components/ExperienceSection'
import EducationSection from '../components/EducationSection'
import ClubsSection from '../components/ClubsSection'
import CertificationsSection from '../components/CertificationsSection'
import GallerySection from '../components/GallerySection'

export default function Home() {
  const [state, setState] = useState({
    hero: null, skills: [], projects: [], experience: [],
    education: [], clubs: [], certifications: [], gallery: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const [hero, skills, projects, experience, education, clubs, certifications, gallery] = await Promise.all([
        supabase.from('hero').select('*').single(),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order'),
        supabase.from('clubs').select('*').order('sort_order'),
        supabase.from('certifications').select('*').order('sort_order'),
        supabase.from('gallery').select('*').order('sort_order'),
      ])
      setState({
        hero: hero.data,
        skills: skills.data || [],
        projects: projects.data || [],
        experience: experience.data || [],
        education: education.data || [],
        clubs: clubs.data || [],
        certifications: certifications.data || [],
        gallery: gallery.data || [],
      })
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"/>
        <p className="text-white/30 text-sm">Loading portfolio…</p>
      </div>
    </div>
  )

  if (!state.hero) return (
    <div className="min-h-screen flex items-center justify-center text-white/40 text-sm">
      Database not set up. Please run the SQL schema first.
    </div>
  )

  const upd = (key) => (val) => setState(s => ({ ...s, [key]: val }))

  return (
    <>
      <HeroSection data={state.hero} onUpdate={upd('hero')}/>
      <SkillsSection data={state.skills} onUpdate={upd('skills')}/>
      <ProjectsSection data={state.projects} onUpdate={upd('projects')}/>
      <ExperienceSection data={state.experience} onUpdate={upd('experience')}/>
      <EducationSection data={state.education} onUpdate={upd('education')}/>
      <ClubsSection data={state.clubs} onUpdate={upd('clubs')}/>
      <CertificationsSection data={state.certifications} onUpdate={upd('certifications')}/>
      <GallerySection data={state.gallery} onUpdate={upd('gallery')}/>
    </>
  )
}
