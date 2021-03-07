/**
 * Build styles
 */
require('./../styles/index.pcss');

/**
 * @typedef {Object} BlockToolData
 */

/**
 * @typedef {Object} ListData
 * @property {string} style - list type 'ordered' or 'unordered'
 * @property {ListItem[]} items
 */

/**
 * @typedef {Object} ListItem
 * @property {string} content
 * @property {ListItem[]} items
 */

/**
 * NestedList Tool for EditorJS
 */
export default class NestedList {

  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      title: 'List',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    /**
     * HTML nodes
     *
     * @private
     */
    this._elements = {
      wrapper: null,
    };

    this.api = api;
    this.readOnly = readOnly;

    this.settings = [
      {
        name: 'unordered',
        title: this.api.i18n.t('Unordered'),
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
        default: false,
      },
      {
        name: 'ordered',
        title: this.api.i18n.t('Ordered'),
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
        default: true,
      },
    ];

    /**
     * Tool's data
     *
     * @type {ListData}
     */
    this._data = {
      style: this.settings.find((tune) => tune.default === true).name,
      items: [],
    };

    this.data = data;
  }

  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    this._elements.wrapper = this.makeMainTag(this._data.style);

    const renderList = (items, element) => {
      items.forEach((item) => {
        element.appendChild(this._make('li', this.CSS.item, {
          innerHTML: item.content,
        }));

        if (item.items && item.items.length > 0) {
          const sublistWrapper = this.makeMainTag(this._data.style);

          renderList(item.items, sublistWrapper);

          element.appendChild(sublistWrapper);
        }
      });
    }

    // fill with data
    if (this._data.items.length) {
      renderList(this._data.items, this._elements.wrapper);
    } else {
      this._elements.wrapper.appendChild(this._make('li', this.CSS.item));
    }

    if (!this.readOnly) {
      // detect keydown on the last item to escape List
      this._elements.wrapper.addEventListener('keydown', (event) => {
        const [ENTER, BACKSPACE, TAB] = [13, 8, 9]; // key codes

        switch (event.keyCode) {
          case ENTER:
            this.getOutofList(event);
            break;
          case BACKSPACE:
            this.backspace(event);
            break;
          case TAB:
            this.addTab(event);
            break;
        }
      }, false);
    }

    return this._elements.wrapper;
  }

  /**
   * @returns {ListData}
   * @public
   */
  save() {
    return this.data;
  }

  /**
   * Allow List Tool to be converted to/from other block
   *
   * @returns {{export: Function, import: Function}}
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol.
       *
       * @param {ListData} data - list data to create a string from thats
       * @returns {string}
       */
      export: (data) => {
        return data.items.join('. ');
      },
      /**
       * To create a list from other block's string, just put it at the first item
       *
       * @param {string} string - string to create list tool data from that
       * @returns {ListData}
       */
      import: (string) => {
        return {
          items: [ string ],
          style: 'unordered',
        };
      },
    };
  }

  /**
   * Sanitizer rules
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      style: {},
      items: {
        br: true,
      },
    };
  }

  /**
   * Settings
   *
   * @public
   * @returns {Element}
   */
  renderSettings() {
    const wrapper = this._make('div', [ this.CSS.settingsWrapper ], {});

    this.settings.forEach((item) => {
      const itemEl = this._make('div', this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      itemEl.addEventListener('click', () => {
        this.toggleTune(item.name);

        // clear other buttons
        const buttons = itemEl.parentNode.querySelectorAll('.' + this.CSS.settingsButton);

        Array.from(buttons).forEach((button) =>
            button.classList.remove(this.CSS.settingsButtonActive)
        );

        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      this.api.tooltip.onHover(itemEl, item.title, {
        placement: 'top',
        hidingDelay: 500,
      });

      if (this._data.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }

  // /**
  //  * On paste callback that is fired from Editor
  //  *
  //  * @param {PasteEvent} event - event with pasted data
  //  */
  // onPaste(event) {
  //   const list = event.detail.data;
  //
  //   this.data = this.pasteHandler(list);
  // }
  //
  // /**
  //  * List Tool on paste configuration
  //  *
  //  * @public
  //  */
  // static get pasteConfig() {
  //   return {
  //     tags: ['OL', 'UL', 'LI'],
  //   };
  // }
  //
  // /**
  //  * Handle UL, OL and LI tags paste and returns List data
  //  *
  //  * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
  //  * @returns {ListData}
  //  */
  // pasteHandler(element) {
  //   const { tagName: tag } = element;
  //   let style;
  //
  //   switch (tag) {
  //     case 'OL':
  //       style = 'ordered';
  //       break;
  //     case 'UL':
  //     case 'LI':
  //       style = 'unordered';
  //   }
  //
  //   const data = {
  //     style,
  //     items: [],
  //   };
  //
  //   if (tag === 'LI') {
  //     data.items = [ element.innerHTML ];
  //   } else {
  //     const items = Array.from(element.querySelectorAll('LI'));
  //
  //     data.items = items
  //         .map((li) => li.innerHTML)
  //         .filter((item) => !!item.trim());
  //   }
  //
  //   return data;
  // }

  /**
   * Creates main <ul> or <ol> tag depended on style
   *
   * @param {string} style - 'ordered' or 'unordered'
   * @returns {HTMLOListElement|HTMLUListElement}
   */
  makeMainTag(style){
    const styleClass = style === 'ordered' ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered;
    const tag = style === 'ordered' ? 'ol' : 'ul';

    return this._make(tag, [this.CSS.baseBlock, this.CSS.wrapper, styleClass], {
      contentEditable: !this.readOnly,
    });
  }

  /**
   * Toggles List style
   *
   * @param {string} style - 'ordered'|'unordered'
   */
  toggleTune(style) {
    this._data = this.data;
    this._data.style = style;

    this._elements.wrapper.replaceWith(this.render());
  }

  /**
   * Styles
   *
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: 'cdx-nested-list',
      wrapperOrdered: 'cdx-nested-list--ordered',
      wrapperUnordered: 'cdx-nested-list--unordered',
      item: 'cdx-nested-list__item',
      settingsWrapper: 'cdx-nested-list__settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * List data setter
   *
   * @param {ListData} listData
   */
  set data(listData) {
    if (!listData) {
      listData = {};
    }

    this._data.style = listData.style || this.settings.find((tune) => tune.default === true).name;
    this._data.items = listData.items || [];

    const oldView = this._elements.wrapper;

    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  /**
   * Return List data
   *
   * @returns {ListData}
   */
  get data() {
    this._data.items = [];

    const itemSelector = `${this.CSS.item}`;

    function serialize(parent) {
      const serialized = [];
      const children = [].slice.call(parent.children);

      for (let i = 0; i < children.length; i++) {
        if (!children[i].classList.contains(itemSelector)) continue;

        let items = [];

        try {
          const isNextNested = !children[i + 1].classList.contains(itemSelector);

          if (isNextNested) {
            items = serialize(children[i + 1]);
          }
        } catch (e) {}

        serialized.push({
          content: children[i].innerHTML,
          items: items
        });
      }

      return serialized;
    }

    this._data.items = serialize(this._elements.wrapper);

    return this._data;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }

    return currentNode.closest(`.${this.CSS.item}`);
  }

  /**
   * Get out from List Tool
   * by Enter on the empty last item
   *
   * @param {KeyboardEvent} event
   */
  getOutofList(event) {
    const items = this._elements.wrapper.querySelectorAll('.' + this.CSS.item);

    /**
     * Save the last one.
     */
    if (items.length < 2) {
      return;
    }

    const lastItem = items[items.length - 1];
    const currentItem = this.currentItem;

    /** Prevent Default li generation if item is empty */
    if (currentItem === lastItem && !lastItem.textContent.trim().length) {
      /** Insert New Block and set caret */
      currentItem.parentElement.removeChild(currentItem);
      this.api.blocks.insert();
      this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event
   */
  backspace(event) {
    const items = this._elements.wrapper.querySelectorAll('.' + this.CSS.item),
        firstItem = items[0];

    if (!firstItem) {
      return;
    }

    /**
     * Save the last one.
     */
    if (items.length < 2 && !firstItem.innerHTML.replace('<br>', ' ').trim()) {
      event.preventDefault();
    }
  }

  addTab(event){
    if (this.currentItem === this.currentItem.parentNode.childNodes[0]) {
      return
    }

    const style = this._data.style === 'ordered' ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered;
    let ol = this._make('ul', [this.CSS.baseBlock, this.CSS.wrapper, style], {
      contentEditable: true,
    });

    if (this.currentItem.nextSibling != null) {
      this.currentItem.parentNode.insertBefore(ol, this.currentItem.nextSibling)
    } else {
      this.currentItem.parentNode.appendChild(ol)
    }

    ol.appendChild(this.currentItem)

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Select LI content by CMD+A
   *
   * @param {KeyboardEvent} event
   */
  selectItem(event) {
    event.preventDefault();

    const selection = window.getSelection(),
        currentNode = selection.anchorNode.parentNode,
        currentItem = currentNode.closest('.' + this.CSS.item),
        range = new Range();

    range.selectNodeContents(currentItem);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}