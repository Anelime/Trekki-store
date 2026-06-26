export type PageId =
  | "home"
  | "longsleeves"
  | "tshirts"
  | "buffs"
  | "fabrics"
  | "printing"
  | "sizes"
  | "future-items";

export type LayoutKind = "home" | "page";

export type FormConfig = {
  product?: string;
  contextLabel?: string;
  comment?: string;
  cta?: string;
  endpoint?: string;
};

export type PageConfig = {
  id: PageId;
  layout: LayoutKind;
  content: string;
  form: FormConfig;
};

export type SelectionContextOptions = {
  product?: string;
  submitLabel?: string;
};

export type TrekkiFormApi = {
  setProduct: (value?: string | null) => void;
  setCommentContext: (label?: string | null, value?: string | null) => void;
  setSubmitLabel: (value?: string | null) => void;
  setSelectionContext: (title?: string | null, text?: string | null, options?: SelectionContextOptions) => void;
  clearSelectionContext: () => void;
};

declare global {
  interface Window {
    TrekkiForm?: TrekkiFormApi;
    TREKKI_FORM_ENDPOINT?: string;
  }
}
