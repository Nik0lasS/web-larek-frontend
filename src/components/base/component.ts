export abstract class Component<T extends object> {
  protected constructor(protected readonly container: HTMLElement) {
  }
  // добавить или удалить класс у HTML-элемента
  toggleClass(element: HTMLElement, className: string) {
      element.classList.toggle(className);
  }
  // Установить текстовое содержимое HTML-элемента
  protected setTextСontent(element: HTMLElement, value: unknown) {
      if (element) {
          element.textContent = String(value);
      }
  }
  // Измененить статус блокировки HTML-элемент
  setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
          if (state) element.setAttribute('disabled', 'disabled');
          else element.removeAttribute('disabled');
      }
  }
  // Скрыть HTML-элемент
  protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
  }
  // Показать HTML-элемент
  protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
  }
  // Установить изображение с алтернативным текстом в HTML-элемент
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }
  // Отрендерить HTML-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}