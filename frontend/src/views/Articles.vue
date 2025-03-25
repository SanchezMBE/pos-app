<template>
    <div class="row">
        <div class="col-lg-8 offset-lg-2">
            <div class="table-responsive">
                <DataTable :data="products" :columns="columns" class="table table-striped table-bordered display"
                :options="{
                    responsive: true,
                    autoWidth: false,
                    dom: 'Bfrtip',
                    language: {
                        search: 'Buscar:',
                        zeroRecords: 'No hay registros',
                        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                        infoEmpty: 'Mostrando del _START_ a _END_ de _TOTAL_ registros',
                        infoFiltered: '(filtrado de _MAX_ registros totales)',
                        paginate: {
                            first: 'Primero',
                            last: 'Último',
                            next: 'Siguiente',
                            previous: 'Anterior'
                        }
                    },
                    buttons: this.botones
                }">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import Buttons from 'datatables.net-buttons-bs5';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import print from 'datatables.net-buttons/js/buttons.print';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-responsive-bs5';
import JsZip from 'jszip';

window.JSZip = JsZip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

DataTable.use(DataTableLib);
DataTable.use(Buttons);
DataTable.use(ButtonsHtml5);
DataTable.use(print);
DataTable.use(pdfMake);

export default {
    components: {
        DataTable
    },
    data() {
        return {
            products: [],
            columns: [
                { data: null, render: function (data, type, row, meta) { return `${meta.row + 1}`; } },
                { data: 'name' },
                { data: 'description' },
                { data: 'price' },
                { data: 'stock' },
            ],
            botones: [
                {
                    title: 'Reporte de Productos',
                    extend: 'excelHtml5',
                    text: '<i class="fa-solid fa-file-excel"></i> Excel',
                    className: 'btn btn-success',
                },
                {
                    title: 'Reporte de Productos',
                    extend: 'pdfHtml5',
                    text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger', 
                },
                {
                    title: 'Reporte de Productos',
                    extend: 'csvHtml5',
                    text: '<i class="fa-solid fa-file-csv"></i> CSV',
                    className: 'btn btn-info',
                },
                {
                    title: 'Reporte de Productos',
                    extend: 'print',
                    text: '<i class="fa-solid fa-print"></i> Imprimir',
                    className: 'btn btn-primary',
                }
            ]
        };
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        getProducts() {
            axios.get('http://laraproducts.run/api/products')
            .then(response => {
                this.products = response.data;
            })
            .catch(error => {
                console.log("Error al obtener productos:", error);
            });
        }
    }
};
</script>
