import {useId, useState} from 'react';
import {FAQ_ITEMS} from '~/constants/content';

export function FAQAccordion() {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section" aria-labelledby="faq-h">
      <div className="section__inner section__inner--narrow">
        <h2 id="faq-h" className="section__title">
          Common questions
        </h2>
        <div className="faq">
          {FAQ_ITEMS.map((item, index) => {
            const panelId = `${id}-panel-${index}`;
            const buttonId = `${id}-btn-${index}`;
            const isOpen = open === index;
            return (
              <div key={item.question} className="faq__item">
                <button
                  type="button"
                  id={buttonId}
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {item.question}
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq__answer"
                  hidden={!isOpen}
                >
                  <p className="muted">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
