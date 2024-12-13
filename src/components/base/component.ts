import { IEvents } from './events';

export abstract class Component<T extends object = object> {
  protected constructor(protected readonly _container: HTMLElement, protected _events: IEvents) {

  }
  // добавить или удалить класс у HTML-элемента
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
      element.classList.toggle(className, force);
  }
  // Установить текстовое содержимое HTML-элемента
  protected setText(element: HTMLElement, value: unknown) {
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
      return this._container;
  }
}