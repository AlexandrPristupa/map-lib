import { DataStore } from './datastore';
import { InfoPanel } from './infopanel';
import { Filters } from './filters';
import { FiltersWidget } from './filters.widget';
import { Global } from './global';
import { GP } from './gp';
import { DataGridNonSighted } from './grid.nonsighted';
import { DataGrid } from './datagrid';
import { InfoBar } from './infobar';
import { MasterForm } from './masterform';
import { Search } from './search';
import { MapLib } from './maplib';




class App {

    public dataStore: DataStore;
    public dataGrid: DataGrid;
    public infoPanel: InfoPanel;
    public filters: Filters;
    public filtersWidget: FiltersWidget;
    public global: Global;
    public gp: GP;
    public dataGridNonSighted: DataGridNonSighted;
    public mapLib: MapLib;
    public infoBar: InfoBar;
    public masterForm: MasterForm;
    public search: Search;

   constructor() {

        this.dataGrid = new DataGrid();
        this.dataStore = new DataStore();
        this.global = new Global();
        this.mapLib = new MapLib();
        this.infoPanel = new InfoPanel();
        this.filters = new Filters();
        this.filtersWidget = new FiltersWidget();
        this.gp = new GP();
        this.dataGridNonSighted = new DataGridNonSighted();
        this.infoBar = new InfoBar();
        this.masterForm = new MasterForm();
        this.search = new Search();

   }

}

new App();