"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Calendar, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CERTIFICATIONS } from "@/lib/config";
import CertificationModal from "@/components/certification-modal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TaskManager() {
  const [selectedCertification, setSelectedCertification] = useState<
    (typeof CERTIFICATIONS)[0] | null
  >(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold">Certification Tracker</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-2">
          <h2 className="text-3xl font-bold mb-2">Certification Journey</h2>
          <p>Track your progress through certifications</p>
        </div>

        <div className="py-6">
          <Badge variant="secondary">4 Certifications</Badge>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CERTIFICATIONS.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer h-full backdrop-blur-sm hover:shadow transition-all duration-300 group"
                onClick={() => setSelectedCertification(cert)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border">
                      {cert.name.split("-")[0]}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Fundamentals
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:underline transition-colors">
                    {cert.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {cert.month}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {cert.duration}
                    </div>
                    <div className="pt-2">
                      <div className="text-xs mb-1">Weekly Tasks</div>
                      <div className="text-sm font-medium">
                        {cert.weeklyTasks.length} tasks planned
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Modal */}
      <CertificationModal
        certification={selectedCertification}
        isOpen={!!selectedCertification}
        onClose={() => setSelectedCertification(null)}
      />
    </div>
  );
}
