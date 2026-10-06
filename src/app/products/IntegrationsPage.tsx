import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";
import { useCourses } from "../context/CourseContext";

export default function IntegrationsPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { enrollInCourse, isEnrolled } = useCourses();

  const [pods, setPods] = useState([
    { id: "astra-core-7f8a1", status: "Running", cpu: "12m", memory: "48Mi", ready: "1/1" },
    { id: "astra-core-7f8a2", status: "Running", cpu: "14m", memory: "52Mi", ready: "1/1" },
    { id: "astra-core-7f8a3", status: "Running", cpu: "11m", memory: "46Mi", ready: "1/1" },
  ]);
  const [isDeploying, setIsDeploying] = useState(false);

  const enrolled = isEnrolled("cloud-devops-k8s");

  const handleDeployNewVersion = () => {
    setIsDeploying(true);
    const newPodId = `astra-core-9b2c${Math.floor(10 + Math.random() * 89)}`;
    
    // Add pending pod
    setPods((prev) => [
      { id: newPodId, status: "ContainerCreating", cpu: "0m", memory: "12Mi", ready: "0/1" },
      ...prev.slice(0, 2)
    ]);

    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) => (p.id === newPodId ? { ...p, status: "Running", ready: "1/1", cpu: "15m", memory: "50Mi" } : p))
      );
      setIsDeploying(false);
    }, 1200);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-16">
        {/* Domain Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span>☁️</span> Cloud & DevOps Track
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Master Cloud Infrastructure: <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400">
              Kubernetes, Terraform & GitOps
            </em>
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            From containerizing applications with multi-stage Dockerfiles to provisioning multi-region AWS/GCP clusters with Terraform and automated ArgoCD GitOps pipelines.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                enrollInCourse("cloud-devops-k8s");
                navigate("/learn/cloud-devops-k8s");
              }}
              className="button button-lg text-xs font-extrabold shadow-xl hover:scale-105 transition-transform"
            >
              {enrolled ? "Resume DevOps Classroom →" : "Enroll in DevOps Masterclass Free →"}
            </button>
            <a href="#playground" className="button-secondary button-lg text-xs font-bold">
              <span>⚡</span> Launch Cluster Simulator
            </a>
          </div>
        </section>

        {/* Interactive Kubernetes & GitOps Lab */}
        <section id="playground" className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Live Kubernetes Cluster Simulator</span>
              <h2 className="text-lg font-black mt-0.5">Automated Rolling Deployment & Pod Scaling</h2>
            </div>
            <button
              onClick={handleDeployNewVersion}
              disabled={isDeploying}
              className="button button-sm text-xs font-bold flex items-center gap-1.5"
            >
              <span>{isDeploying ? "Rolling out..." : "🚀 Trigger GitOps Canary Deployment"}</span>
            </button>
          </div>

          {/* Pods Table Simulator */}
          <div className="rounded-2xl bg-[#090812] border border-amber-500/20 overflow-hidden font-mono text-xs">
            <div className="p-3 bg-[#110e20] border-b border-gray-800 flex justify-between text-[11px] text-gray-400">
              <span>Cluster: k8s.astra.production (us-east-1)</span>
              <span>Namespace: default • Deployment: astra-core (v2.6)</span>
            </div>

            <div className="divide-y divide-gray-800">
              <div className="grid grid-cols-4 p-3 text-gray-500 font-bold text-[10px] uppercase">
                <span>Pod Name</span>
                <span>Ready</span>
                <span>Status</span>
                <span>CPU / Mem</span>
              </div>
              {pods.map((pod) => (
                <div key={pod.id} className="grid grid-cols-4 p-3 items-center text-gray-300">
                  <span className="text-amber-300 font-bold truncate pr-2">{pod.id}</span>
                  <span>{pod.ready}</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${pod.status === "Running" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-spin"}`} />
                    <span className={pod.status === "Running" ? "text-emerald-400" : "text-amber-400"}>{pod.status}</span>
                  </span>
                  <span className="text-gray-400">{pod.cpu} / {pod.memory}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Masterclass Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Curriculum Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-black">Production Cloud Infrastructure Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">☸️</span>
              <h3 className="text-base font-extrabold">1. Production Kubernetes</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Master Deployments, StatefulSets, Ingress NGINX, Horizontal Pod Autoscaling (HPA), and zero-downtime rolling upgrades.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🏗️</span>
              <h3 className="text-base font-extrabold">2. Terraform & Cloud IaC</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Provision repeatable VPC networks, IAM security roles, managed EKS/GKE clusters, and RDS databases with modular HCL code.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🔄</span>
              <h3 className="text-base font-extrabold">3. GitOps & ArgoCD CI/CD</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Implement automated continuous delivery with ArgoCD, Helm charts, automated rollback canaries, and Prometheus observability.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
