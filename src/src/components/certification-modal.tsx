"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X, ExternalLink, Calendar, Clock, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Certification {
  id: string;
  name: string;
  month: string;
  duration: string;
  resources: Array<{
    title: string;
    url: string;
  }>;
  weeklyTasks: string[];
}

interface CertificationModalProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificationModal({
  certification,
  isOpen,
  onClose,
}: CertificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (
      isOpen &&
      modalRef.current &&
      overlayRef.current &&
      contentRef.current
    ) {
      gsap.set([overlayRef.current, contentRef.current], { clearProps: "all" });

      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      ).fromTo(
        contentRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
        "-=0.1",
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: onClose,
      });

      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.1",
      );
    } else {
      onClose();
    }
  };

  const toggleTask = (taskIndex: number) => {
    if (!certification) return;
    const key = `${certification.id}-${taskIndex}`;
    setCheckedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCompletedTasksCount = () => {
    if (!certification) return 0;
    return certification.weeklyTasks.filter(
      (_, index) => checkedTasks[`${certification.id}-${index}`],
    ).length;
  };

  if (!certification) return null;

  const completedTasks = getCompletedTasksCount();
  const totalTasks = certification.weeklyTasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        ref={modalRef}
        className="max-w-2xl max-h-[90vh] overflow-hidden p-0 backdrop-blur border"
        onPointerDownOutside={handleClose}
      >
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/20 backdrop-blur z-50"
          onClick={handleClose}
        />

        <div
          ref={contentRef}
          className="relative z-50 rounded-lg shadow"
        >
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold mb-2">
                  {certification.name}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {certification.month}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {certification.duration}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Progress</h3>
                <Badge>{completedTasks}/{totalTasks} completed</Badge>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-neutral-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Tasks */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Weekly Study Tasks
              </h3>
              <div className="space-y-3">
                {certification.weeklyTasks.map((task, index) => {
                  const isChecked =
                    checkedTasks[`${certification.id}-${index}`] || false;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-900 transition-colors"
                    >
                      <Checkbox
                        id={`task-${index}`}
                        checked={isChecked}
                        onCheckedChange={() => toggleTask(index)}
                      />
                      <label
                        htmlFor={`task-${index}`}
                        className={`flex-1 text-sm cursor-pointer transition-all ${
                          isChecked
                            ? "line-through opacity-60"
                            : "hover:opacity-90"
                        }`}
                      >
                        Week {index + 1}: {task}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Learning Resources
              </h3>
              <div className="space-y-3">
                {certification.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-neutral-900 transition-all duration-200"
                  >
                    <span className="font-medium">{resource.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
