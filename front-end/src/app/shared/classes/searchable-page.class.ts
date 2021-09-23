import { ActivatedRoute, Router } from '@angular/router';

export abstract class SearchablePage {
    protected searchTimeout: any;
    protected router: Router;
    protected activatedRoute: ActivatedRoute;

    abstract params: { [key: string]: number | string | boolean };

    async onFilterChange (): Promise<void> {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => {
            await this.router.navigate(
                [],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: this.params
                }
            );
        }, 200);
    }
}
