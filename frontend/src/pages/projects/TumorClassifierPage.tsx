import {
  BackLink,
  Beat,
  Bridge,
  Card,
  Feature,
  Hero,
  ImpactList,
  Intro,
  Lede,
  Reflection,
  Section,
} from "@/components/case-study/CaseStudy";

export default function TumorClassifierPage() {
  return (
    <div className="max-w-[740px] mx-auto pb-24">
      <Hero
        src="/cmpt310.jpg"
        alt="Comparative diagnostic system for breast cancer classification"
      />

      <Intro
        meta={[
          { label: "Timeline", value: "CMPT 310 — Fall 2025" },
          { label: "Role", value: "Team of 2 — modeling + analysis" },
          { label: "Stack", value: "Python, scikit-learn, NumPy, pandas" },
          { label: "Result", value: "~96% accuracy, recall-tuned" },
        ]}
      >
        <Lede>
          A comparative diagnostic system that classifies breast tumors as
          benign or malignant — built to minimize missed malignant diagnoses,
          not just maximize accuracy.
        </Lede>
        <p>
          For our CMPT 310 final project, we built and compared three machine
          learning classifiers on the UCI Breast Cancer Wisconsin dataset
          (569 samples, 30 features). The goal wasn't a leaderboard score —
          it was building the right system for a domain where false negatives
          are catastrophic and false positives are recoverable.
        </p>
        <p>
          That framing — recall over accuracy — drove every decision: model
          choice, threshold tuning, and how we evaluated the final pipeline.
        </p>
        <p>
          Code on{" "}
          <a
            href="https://github.com/kunaljoshi2/Tumor-Classifier"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            GitHub →
          </a>
        </p>
      </Intro>

      <Section
        eyebrow="THE PROBLEM"
        heading="Why accuracy is the wrong metric here"
      >
        <div className="space-y-10">
          <Beat
            title="False negatives kill"
            body="A model that misses a malignant tumor sends a sick person home with a clean bill of health. A model that flags a benign tumor sends a healthy person to a follow-up biopsy. These are not symmetric errors — and any metric that treats them as such is the wrong metric."
          />
          <Beat
            title="Imbalance hides the failure mode"
            body="The dataset is roughly 63% benign / 37% malignant. A model that predicts 'benign' for everything still scores 63% accuracy — and looks fine on a confusion matrix glanced at quickly. We needed evaluation that would surface that failure, not paper over it."
          />
        </div>
      </Section>

      <Section eyebrow="FIRST PASS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Default scikit-learn">
            <p>
              We started with out-of-the-box logistic regression, KNN, and a
              decision tree on raw features. Accuracy hit 94% on the first
              try, which was suspicious — and recall on the malignant class
              was lower than the headline number suggested.
            </p>
          </Card>
          <Card title="What was missing" tone="muted">
            <p>
              No feature scaling (KNN was secretly broken), no
              cross-validation (single-split scores were noisy), and no
              recall-aware thresholding (every model was using 0.5 by
              default). The "easy 94%" was leaving real malignant cases on the
              table.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="THE SYSTEM WE BUILT"
        heading="Three models, one recall-first pipeline"
      >
        <Feature
          number={1}
          title="Logistic regression from scratch"
          body="Rather than using sklearn's implementation, we wrote logistic regression from scratch — gradient descent, L2 regularization, and a configurable learning rate. Building it ourselves made the bias/variance trade-offs visible: we could see exactly how regularization strength shifted the decision boundary."
          image="/cmpt310.jpg"
          alt="Logistic regression decision boundary visualization"
        />

        <Bridge>
          One model was a baseline. Three made the trade-offs visible.
        </Bridge>

        <Feature
          number={2}
          title="KNN + Decision Tree, tuned"
          body="We added a tuned KNN classifier and a decision tree, both selected via 5-fold stratified K-fold grid search over hyperparameters. Stratification kept the class balance consistent across folds — important when the minority class is the one that matters most."
          image="/cmpt310.jpg"
          alt="Cross-validation results across model families"
          reverse
        />

        <Bridge>
          Then the actual win — making the system care about the right error.
        </Bridge>

        <Feature
          number={3}
          title="F2-score threshold tuning"
          body="Instead of using each model's default 0.5 cutoff, we swept the decision threshold and selected the value that maximized the F2 score — which weights recall twice as heavily as precision. This pushed recall on malignant cases up without collapsing precision into uselessness."
          image="/cmpt310.jpg"
          alt="F2 score across decision thresholds"
        />
      </Section>

      <Section eyebrow="REFLECTIONS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reflection title="The metric is the model">
            Choosing F2 over accuracy or F1 wasn't a tweak — it was the actual
            design decision. Once we picked the right loss to optimize against,
            most of the modeling choices fell out of it. Picking the metric
            first, then the model, is the lesson I'm taking forward.
          </Reflection>
          <Reflection title="Building from scratch teaches what libraries hide">
            Reimplementing logistic regression took an extra weekend and was
            never going to beat sklearn's version. But debugging our own
            gradient descent — watching it diverge with the wrong learning
            rate, stabilize with L2 — taught more than any tutorial would.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="WHAT'S NEXT">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <Reflection title="Calibrated probabilities">
            Right now the threshold is tuned, but the underlying probabilities
            aren't calibrated. Platt scaling or isotonic regression would let
            the model say "70% likely malignant" and have that mean something
            — useful if it ever fed into a downstream decision system.
          </Reflection>
          <Reflection title="Ensemble vote">
            All three classifiers agree on the easy cases and disagree on the
            hard ones. A simple majority-vote ensemble — or stacking with a
            meta-learner — would likely squeeze out the last few missed
            malignant cases.
          </Reflection>
          <Reflection title="Feature interpretability">
            Add SHAP values to surface which of the 30 features drove each
            prediction. In a clinical context, "this is malignant" is much
            less useful than "this is malignant because of feature X."
          </Reflection>
          <Reflection title="External validation">
            UCI's dataset is small and clean. Re-running the pipeline against
            a larger, noisier dataset (e.g. TCGA) would test whether the
            threshold-tuning gains hold up under distribution shift.
          </Reflection>
        </div>
      </Section>

      <Section eyebrow="IMPACT">
        <ImpactList
          items={[
            "Reached ~96% accuracy with recall on malignant class prioritized via F2-score threshold tuning.",
            "Compared three model families (logistic regression, KNN, decision tree) under a single evaluation framework.",
            "Implemented logistic regression from scratch with gradient descent and L2 regularization.",
            "Made the case that domain context — not just model choice — should drive evaluation.",
          ]}
        />
      </Section>

      <BackLink />
    </div>
  );
}
