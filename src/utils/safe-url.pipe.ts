import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
	name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
	constructor(private _domSanitizer: DomSanitizer) {}
	transform(url: any): SafeResourceUrl {
		return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
