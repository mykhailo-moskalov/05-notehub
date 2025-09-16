import css from "./Modal.module.css";

export default function Modal() {
  return (
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}>{/* */}</div>
    </div>
  );
}
