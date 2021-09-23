import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IdHelper } from '../../../../../../back-end/src/helpers/id.helper';
import { BbcodeClass } from '../../classes/bbcode.class';
import { GlobalBbcodeService } from '../../../core/common-services/global-bbcode.service';

declare var $: any;

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})
export class EditorComponent implements AfterViewInit {
    private id = IdHelper.newUuid();
    private content: string;
    private editor;
    private bbcodes: Array<BbcodeClass> = null;
    @ViewChild('editor') myEditorWrapper: ElementRef<HTMLTemplateElement>;

    constructor (globalBbcodeService: GlobalBbcodeService) {
        globalBbcodeService.getBbcodes().then(bbcodes => {
            this.bbcodes = bbcodes;
            this.initEditor();
        });
    }

    getContent (): string {
        return this.editor ? this.editor.getBBCode() : '';
    }

    setContent (content: string): void {
        this.content = content || '';
        // @ts-ignore
        $(document).ready(() => {
            if (this.editor) {
                this.editor.bbcode(content);
            }
        });
    }

    ngAfterViewInit (): void {
        this.initEditor();
    }

    private initEditor (): void {
        if (!this.bbcodes || !this.myEditorWrapper) {
            return;
        }

        this.myEditorWrapper.nativeElement.className = this.id;
        // @ts-ignore
        $(document).ready(() => {
            const settings = this.getSettings(this.id);
            // @ts-ignore
            this.editor = $(`.${this.id}`).wysibb(settings);
            this.editor.bbcode(this.content);
        });
    }

    private getSettings (id: string): any {
        const atitleTransform = {};
        const systr = this.bbcodes
            .filter(bbcode => bbcode.editorPattern)
            .reduce((prev, curr) => {
                if (curr.editorPattern === '[atitle]{DATA}[/atitle]') {
                    atitleTransform[curr.editorReplacement] = curr.editorPattern;
                }
                prev[curr.editorReplacement] = curr.editorPattern;
                return prev;
            }, {});
        return {
            id: id,
            debug: false,
            minheight: 150,
            buttons: 'bold,italic,underline,strike|,img,video,link,|,bullist,numlist,|,fontcolor,fontsize' +
                ',fontfamily,|,justifyleft,justifycenter,justifyright,|,atitle,,quote,code,table,removeFormat,test',
            systr: systr,
            allButtons: {
                quote: {
                    title: 'Spoiler',
                    transform: {
                        '<details><summary>Spoiler</summary>{SELTEXT}</details>': '[spoiler]{SELTEXT}[/spoiler]'
                    }
                },
                atitle: {
                    title: 'Title',
                    buttonHTML: '<span class="fonticon ve-tlb-bold1 btn-inner">Title</span>',
                    hotkey: 'ctrl+t',
                    transform: atitleTransform
                }
            }
        };
    }
}
