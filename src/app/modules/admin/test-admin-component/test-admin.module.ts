import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TestAdminComponentComponent } from 'app/modules/admin/test-admin-component/test-admin-component.component';

const testAdminRoute: Route[] = [
    {
        path: '',
        component: TestAdminComponentComponent,
    },
];

@NgModule({
    declarations: [TestAdminComponentComponent],
    imports: [RouterModule.forChild(testAdminRoute)],
})
export class TestAdminModule {}
