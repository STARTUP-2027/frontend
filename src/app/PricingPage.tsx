import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Icon, Logo, SiteFooter, SiteNav } from "../App";
import { useTheme } from "./theme";

export default function PricingPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pricingPlans = [
    {
      name: "Starter Pass",
      icon: "bolt" as const,
      copy: "For self-paced developers starting their tech and AI journey.",
      monthly: 19,
      features: [
        "Access to 10 foundational courses",
        "Interactive in-browser code sandboxes",
        "Community Discord access",
        "Course completion certificates",
        "Standard support",
      ],
      cta: "Start free learning",
      popular: false,
    },
    {
      name: "Pro All-Access",
      icon: "sparkles" as const,
      copy: "For ambitious engineers advancing to Senior, Staff, and AI roles.",
      monthly: 49,
      features: [
        "Unlimited access to all 50+ masterclasses",
        "Advanced Agentic AI & Rust projects",
        "Verified industry certificates (LinkedIn shareable)",
        "Direct mentor feedback & code reviews",
        "Private GitHub starter repositories",
        "Interactive AI debugging assistant in classroom",
      ],
      cta: "Get Pro All-Access",
      popular: true,
    },
    {
      name: "Team & Enterprise",
      icon: "globe" as const,
      copy: "For engineering orgs and companies scaling technical excellence.",
      monthly: 99,
      customText: "Custom",
      features: [
        "Everything in Pro All-Access",
        "Custom internal Course Creator Studio",
        "Team skill analytics & progress reports",
        "SSO & corporate invoicing",
        "Dedicated curriculum advisor & custom tracks",
        "Private workshops & live Q&A sessions",
      ],
      cta: "Talk to sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Can I change my plan or cancel at any time?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription whenever you want with no hidden fees or contracts. If you cancel, your account remains active until the end of your billing cycle.",
    },
    {
      q: "How does the 14-day free trial work?",
      a: "You get full access to the Pro plan for 14 days without entering a credit card. At the end of the trial, you can choose to upgrade or automatically stay on our free sandbox tier.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers/ACH for annual enterprise contracts.",
    },
    {
      q: "Is there a discount for startups and non-profits?",
      a: "Yes! Qualified early-stage startups and non-profit organizations can receive up to 50% off their first year on the Pro tier. Contact our team to apply.",
    },
    {
      q: "What security compliance standards does Astra meet?",
      a: "Astra is SOC 2 Type II certified, ISO/IEC 27001 accredited, HIPAA ready, and fully compliant with EU GDPR and CCPA regulations.",
    },
  ];

  const featureMatrix = [
    { name: "Course Library Access", starter: "10 Foundational", pro: "All 50+ Masterclasses", enterprise: "Unlimited + Private Tracks" },
    { name: "Interactive Sandboxes", starter: "Standard (Node/Py)", pro: "Advanced (GPU + Rust)", enterprise: "Custom Sandboxes & Clusters" },
    { name: "AI Code Assistant", starter: "Basic Hints", pro: "Real-time AI Copilot", enterprise: "Custom Org Fine-Tuning" },
    { name: "Verified Certificates", starter: "Standard", pro: "LinkedIn Shareable", enterprise: "Accredited Org Badges" },
    { name: "Course Creator Studio", starter: "—", pro: "—", enterprise: "Included (Full Creator Hub)" },
    { name: "Mentor Code Reviews", starter: "Community", pro: "Priority Expert Review", enterprise: "Dedicated Staff Advisor" },
    { name: "Team Analytics & SSO", starter: "—", pro: "—", enterprise: "Included (Okta, Azure, SCIM)" },
  ];

  return (
    <div className={`subpage app pricing-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="product-page-main pricing-main">
        {/* HERO SECTION */}
        <section className="pricing-hero">
          <div className="product-hero-badge">
            <span className="badge-dot" />
            <span>ASTRA ACADEMY MEMBERSHIP</span>
            <span className="badge-pill">Free Starter Tier</span>
          </div>

          <h1 className="product-hero-title">
            Invest in your engineering skills. <br />
            <em className="gradient-text-analytics">Master the future of Tech & AI.</em>
          </h1>

          <p className="product-hero-subtitle">
            Start learning with in-browser sandboxes and interactive masterclasses. 
            Upgrade to Pro All-Access or Team Licensing whenever you're ready.
          </p>

          {/* BILLING TOGGLE (Monthly / Annually) */}
          <div className="billing-toggle pricing-page-toggle">
            <span className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={annual ? "on" : ""}
              aria-label="Toggle annual billing"
            >
              <i />
            </button>
            <span className={annual ? "active" : ""} onClick={() => setAnnual(true)}>
              Annually
            </span>
            <span className="pill pill-green">SAVE 20%</span>
          </div>
        </section>

        {/* PRICING CARDS GRID (Using home screen styling) */}
        <section className="pricing-cards-section">
          <div className="pricing-grid">
            {pricingPlans.map((plan) => {
              const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
              return (
                <article
                  className={`price-card ${plan.popular ? "popular" : ""}`}
                  key={plan.name}
                >
                  {plan.popular && (
                    <span className="popular-tag">
                      <Icon name="sparkles" size={13} /> MOST POPULAR
                    </span>
                  )}
                  <span className="plan-icon">
                    <Icon name={plan.icon} />
                  </span>
                  <h3>{plan.name}</h3>
                  <p>{plan.copy}</p>

                  <div className="price">
                    {plan.name === "Enterprise" ? (
                      <b>{plan.customText}</b>
                    ) : (
                      <>
                        <sup>$</sup>
                        <b>{price}</b>
                        <span>/ user<br />/ month</span>
                      </>
                    )}
                  </div>

                  <button
                    className={plan.popular ? "button" : "price-button"}
                    onClick={() => navigate("/signup")}
                  >
                    {plan.name === "Team & Enterprise" ? "Enroll Engineering Team" : "Start learning free"} <Icon name="arrow" />
                  </button>

                  <small>WHAT’S INCLUDED</small>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <span><Icon name="check" size={13} /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <p className="pricing-note">
            All plans include interactive sandbox access, certificate verification, and Discord community support.
          </p>
        </section>

        {/* FULL FEATURE COMPARISON TABLE */}
        <section className="feature-comparison-section">
          <div className="comparison-header">
            <span className="section-pill-tag">PLAN MATRIX</span>
            <h2>Compare full features & capabilities</h2>
            <p>Every detail transparently outlined so you can pick the right tier for your career or team.</p>
          </div>

          <div className="comparison-table-wrap">
            <div className="comparison-table-head">
              <span>FEATURE</span>
              <span>STARTER</span>
              <span className="col-pro">PRO (POPULAR)</span>
              <span>ENTERPRISE</span>
            </div>

            <div className="comparison-table-body">
              {featureMatrix.map((row, idx) => (
                <div key={idx} className="comparison-row">
                  <span className="feat-name">{row.name}</span>
                  <span className="feat-val">{row.starter}</span>
                  <span className="feat-val col-pro highlight">{row.pro}</span>
                  <span className="feat-val">{row.enterprise}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="pricing-faq-section">
          <div className="faq-header">
            <span className="section-pill-tag">COMMON QUESTIONS</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our billing, trial, and plans.</p>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="faq-question">
                    <h4>{faq.q}</h4>
                    <span className="faq-chevron">
                      <Icon name="chevron" size={16} />
                    </span>
                  </div>
                  {isOpen && <p className="faq-answer">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to unlock exponential engineering momentum?</h2>
            <p>Start learning today with free project-based sandboxes. No credit card required.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Enroll free now
              </Link>
              <Link to="/courses" className="product-secondary-btn">
                Browse course catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
