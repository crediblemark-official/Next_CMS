import { ReactElement, ReactNode, CSSProperties } from 'react';
import { EditorStateSnapshot, Editor, Extensions } from '@tiptap/react';
import { BlockquoteOptions } from '@tiptap/extension-blockquote';
import { BoldOptions } from '@tiptap/extension-bold';
import { CodeOptions } from '@tiptap/extension-code';
import { CodeBlockOptions } from '@tiptap/extension-code-block';
import { HardBreakOptions } from '@tiptap/extension-hard-break';
import { HeadingOptions } from '@tiptap/extension-heading';
import { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule';
import { ItalicOptions } from '@tiptap/extension-italic';
import { LinkOptions } from '@tiptap/extension-link';
import { BulletListOptions, ListItemOptions, ListKeymapOptions, OrderedListOptions } from '@tiptap/extension-list';
import { ParagraphOptions } from '@tiptap/extension-paragraph';
import { StrikeOptions } from '@tiptap/extension-strike';
import { TextAlignOptions } from '@tiptap/extension-text-align';
import { UnderlineOptions } from '@tiptap/extension-underline';
import { BaseEntry, ContentfulClientApi } from 'contentful';
export { createClient } from 'contentful';

type ItemSelector = {
    index: number;
    zone?: string;
};

declare const defaultEditorState: (ctx: EditorStateSnapshot, readOnly: boolean) => {
    isAlignLeft?: undefined;
    canAlignLeft?: undefined;
    isAlignCenter?: undefined;
    canAlignCenter?: undefined;
    isAlignRight?: undefined;
    canAlignRight?: undefined;
    isAlignJustify?: undefined;
    canAlignJustify?: undefined;
    isBold?: undefined;
    canBold?: undefined;
    isItalic?: undefined;
    canItalic?: undefined;
    isUnderline?: undefined;
    canUnderline?: undefined;
    isStrike?: undefined;
    canStrike?: undefined;
    isInlineCode?: undefined;
    canInlineCode?: undefined;
    isBulletList?: undefined;
    canBulletList?: undefined;
    isOrderedList?: undefined;
    canOrderedList?: undefined;
    isCodeBlock?: undefined;
    canCodeBlock?: undefined;
    isBlockquote?: undefined;
    canBlockquote?: undefined;
    canHorizontalRule?: undefined;
} | {
    isAlignLeft: boolean;
    canAlignLeft: boolean;
    isAlignCenter: boolean;
    canAlignCenter: boolean;
    isAlignRight: boolean;
    canAlignRight: boolean;
    isAlignJustify: boolean;
    canAlignJustify: boolean;
    isBold: boolean;
    canBold: boolean;
    isItalic: boolean;
    canItalic: boolean;
    isUnderline: boolean;
    canUnderline: boolean;
    isStrike: boolean;
    canStrike: boolean;
    isInlineCode: boolean;
    canInlineCode: boolean;
    isBulletList: boolean;
    canBulletList: boolean;
    isOrderedList: boolean;
    canOrderedList: boolean;
    isCodeBlock: boolean;
    canCodeBlock: boolean;
    isBlockquote: boolean;
    canBlockquote: boolean;
    canHorizontalRule: boolean;
};

type RichTextSelector = (ctx: EditorStateSnapshot, readOnly: boolean) => Partial<Record<string, boolean>>;
type DefaultEditorState = ReturnType<typeof defaultEditorState>;
type EditorState<Selector extends RichTextSelector = RichTextSelector> = DefaultEditorState & ReturnType<Selector> & Record<string, boolean | undefined>;

interface CredBuildRichTextOptions {
    /**
     * If set to false, the blockquote extension will not be registered
     * @example blockquote: false
     */
    blockquote: Partial<BlockquoteOptions> | false;
    /**
     * If set to false, the bold extension will not be registered
     * @example bold: false
     */
    bold: Partial<BoldOptions> | false;
    /**
     * If set to false, the bulletList extension will not be registered
     * @example bulletList: false
     */
    bulletList: Partial<BulletListOptions> | false;
    /**
     * If set to false, the code extension will not be registered
     * @example code: false
     */
    code: Partial<CodeOptions> | false;
    /**
     * If set to false, the codeBlock extension will not be registered
     * @example codeBlock: false
     */
    codeBlock: Partial<CodeBlockOptions> | false;
    /**
     * If set to false, the document extension will not be registered
     * @example document: false
     */
    document: false;
    /**
     * If set to false, the hardBreak extension will not be registered
     * @example hardBreak: false
     */
    hardBreak: Partial<HardBreakOptions> | false;
    /**
     * If set to false, the heading extension will not be registered
     * @example heading: false
     */
    heading: Partial<HeadingOptions> | false;
    /**
     * If set to false, the horizontalRule extension will not be registered
     * @example horizontalRule: false
     */
    horizontalRule: Partial<HorizontalRuleOptions> | false;
    /**
     * If set to false, the italic extension will not be registered
     * @example italic: false
     */
    italic: Partial<ItalicOptions> | false;
    /**
     * If set to false, the listItem extension will not be registered
     * @example listItem: false
     */
    listItem: Partial<ListItemOptions> | false;
    /**
     * If set to false, the listItemKeymap extension will not be registered
     * @example listKeymap: false
     */
    listKeymap: Partial<ListKeymapOptions> | false;
    /**
     * If set to false, the link extension will not be registered
     * @example link: false
     */
    link: Partial<LinkOptions> | false;
    /**
     * If set to false, the orderedList extension will not be registered
     * @example orderedList: false
     */
    orderedList: Partial<OrderedListOptions> | false;
    /**
     * If set to false, the paragraph extension will not be registered
     * @example paragraph: false
     */
    paragraph: Partial<ParagraphOptions> | false;
    /**
     * If set to false, the strike extension will not be registered
     * @example strike: false
     */
    strike: Partial<StrikeOptions> | false;
    /**
     * If set to false, the text extension will not be registered
     * @example text: false
     */
    text: false;
    /**
     * If set to false, the textAlign extension will not be registered
     * @example text: false
     */
    textAlign: Partial<TextAlignOptions> | false;
    /**
     * If set to false, the underline extension will not be registered
     * @example underline: false
     */
    underline: Partial<UnderlineOptions> | false;
}

type FieldOption = {
    label: string;
    value: string | number | boolean | undefined | null | object;
};
type FieldOptions = Array<FieldOption> | ReadonlyArray<FieldOption>;
interface BaseField {
    label?: string;
    labelIcon?: ReactElement;
    metadata?: FieldMetadata;
    visible?: boolean;
}
interface TextField extends BaseField {
    type: "text";
    placeholder?: string;
    contentEditable?: boolean;
}
interface NumberField extends BaseField {
    type: "number";
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}
interface TextareaField extends BaseField {
    type: "textarea";
    placeholder?: string;
    contentEditable?: boolean;
}
interface SelectField extends BaseField {
    type: "select";
    options: FieldOptions;
}
interface RadioField extends BaseField {
    type: "radio";
    options: FieldOptions;
}
interface RichtextField<UserSelector extends RichTextSelector = RichTextSelector> extends BaseField {
    type: "richtext";
    contentEditable?: boolean;
    initialHeight?: CSSProperties["height"];
    options?: Partial<CredBuildRichTextOptions>;
    renderMenu?: (props: {
        children: ReactNode;
        editor: Editor | null;
        editorState: EditorState<UserSelector> | null;
        readOnly: boolean;
    }) => ReactNode;
    renderInlineMenu?: (props: {
        children: ReactNode;
        editor: Editor | null;
        editorState: EditorState<UserSelector> | null;
        readOnly: boolean;
    }) => ReactNode;
    tiptap?: {
        selector?: UserSelector;
        extensions?: Extensions;
    };
}
interface ArrayField<Props extends {
    [key: string]: any;
}[] = {
    [key: string]: any;
}[], UserField extends {} = {}> extends BaseField {
    type: "array";
    arrayFields: {
        [SubPropName in keyof Props[0]]: UserField extends {
            type: PropertyKey;
        } ? Field<Props[0][SubPropName], UserField> | UserField : Field<Props[0][SubPropName], UserField>;
    };
    defaultItemProps?: Props[0] | ((index: number) => Props[0]);
    getItemSummary?: (item: Props[0], index?: number) => ReactNode;
    max?: number;
    min?: number;
}
interface ObjectField<Props extends any = {
    [key: string]: any;
}, UserField extends {} = {}> extends BaseField {
    type: "object";
    objectFields: {
        [SubPropName in keyof Props]: UserField extends {
            type: PropertyKey;
        } ? Field<Props[SubPropName]> | UserField : Field<Props[SubPropName]>;
    };
}
type Adaptor<AdaptorParams = {}, TableShape extends Record<string, any> = {}, PropShape = TableShape> = {
    name: string;
    fetchList: (adaptorParams?: AdaptorParams) => Promise<TableShape[] | null>;
    mapProp?: (value: TableShape) => PropShape;
};
type NotUndefined<T> = T extends undefined ? never : T;
type ExternalFieldWithAdaptor<Props extends any = {
    [key: string]: any;
}> = BaseField & {
    type: "external";
    placeholder?: string;
    adaptor: Adaptor<any, any, Props>;
    adaptorParams?: object;
    getItemSummary: (item: NotUndefined<Props>, index?: number) => ReactNode;
};
type CacheOpts = {
    enabled?: boolean;
};
interface ExternalField<Props extends any = {
    [key: string]: any;
}> extends BaseField {
    type: "external";
    cache?: CacheOpts;
    placeholder?: string;
    fetchList: (params: {
        query: string;
        filters: Record<string, any>;
    }) => Promise<any[] | null>;
    mapProp?: (value: any) => Props;
    mapRow?: (value: any) => Record<string, string | number | ReactElement>;
    getItemSummary?: (item: NotUndefined<Props>, index?: number) => ReactNode;
    showSearch?: boolean;
    renderFooter?: (props: {
        items: any[];
    }) => ReactElement;
    initialQuery?: string;
    filterFields?: Record<string, Field>;
    initialFilters?: Record<string, any>;
}
type CustomFieldRender<Value extends any> = (props: {
    field: CustomField<Value>;
    name: string;
    id: string;
    value: Value;
    onChange: (value: Value, uiState?: Partial<UiState>) => void;
    readOnly?: boolean;
}) => ReactElement;
interface CustomField<Value extends any> extends BaseField {
    type: "custom";
    render: CustomFieldRender<Value>;
    contentEditable?: boolean;
    key?: string;
}
interface SlotField extends BaseField {
    type: "slot";
    allow?: string[];
    disallow?: string[];
}
type Field<ValueType = any, UserField extends {} = {}> = TextField | RichtextField | NumberField | TextareaField | SelectField | RadioField | ArrayField<ValueType extends {
    [key: string]: any;
}[] ? ValueType : never, UserField> | ObjectField<ValueType, UserField> | ExternalField<ValueType> | ExternalFieldWithAdaptor<ValueType> | CustomField<ValueType> | SlotField;

type Metadata = {
    [key: string]: any;
};
interface FieldMetadata extends Metadata {
}

type ItemWithId = {
    _arrayId: string;
    _originalIndex: number;
    _currentIndex: number;
};
type ArrayState = {
    items: ItemWithId[];
    openId: string;
};
type UiState = {
    leftSideBarVisible: boolean;
    rightSideBarVisible: boolean;
    leftSideBarWidth?: number | null;
    rightSideBarWidth?: number | null;
    mobilePanelExpanded?: boolean;
    itemSelector: ItemSelector | null;
    arrayState: Record<string, ArrayState | undefined>;
    previewMode: "interactive" | "edit";
    componentList: Record<string, {
        components?: string[];
        title?: string;
        visible?: boolean;
        expanded?: boolean;
    }>;
    isDragging: boolean;
    viewports: {
        current: {
            width: number | "100%";
            height: number | "auto";
        };
        controlsVisible: boolean;
        options: Viewport[];
    };
    field: {
        focus?: string | null;
        metadata?: Record<string, any>;
    };
    plugin: {
        current: string | null;
    };
};

type iconTypes = "Smartphone" | "Monitor" | "Tablet";
type Viewport = {
    width: number | "100%";
    height?: number | "auto";
    label?: string;
    icon?: iconTypes | ReactNode;
};

type Entry<Fields extends Record<string, any> = {}> = BaseEntry & {
    fields: Fields;
};
declare function createFieldContentful<T extends Entry = Entry>(contentType: string, options?: {
    client?: ContentfulClientApi<undefined>;
    space?: string;
    accessToken?: string;
    titleField?: string;
    filterFields?: ExternalField["filterFields"];
    initialFilters?: ExternalField["initialFilters"];
}): ExternalField<T>;

export { type Entry, createFieldContentful, createFieldContentful as default };
