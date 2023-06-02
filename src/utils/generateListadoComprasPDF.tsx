// @ts-ignore
import { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import Icono from "/404_Icono.png";
import { NotaPedido } from "@/interfaces/NotaPedido";
import { formatFecha } from "./formatDate";

interface ListadoComprasPDFProps {
  notasPedidoFiltered: NotaPedido[] | undefined;
  data: any
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  image: {
    width: 100,
    height: 100,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 5
  },
  textBold: {
    fontWeight: 'bold'
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#fff',
  },
  tableCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    textAlign: 'center',
    fontSize: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 5,
  },
  logoContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
});

const ListadoNotasPedidoPDF = ({ notasPedidoFiltered, data }: ListadoComprasPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/404_Icono.png" />
        </View>
        <Text style={styles.title}>Listado de Compras</Text>
        <Text style={styles.text}>Fecha: { data.fechaDesde ? formatFecha(data.fechaDesde) : '-'} al {data.fechaHasta ? formatFecha(data.fechaHasta) : '-'}</Text>
        <Text style={styles.text}>Fecha de vencimiento: {data.fechaVencimientoDesde ? formatFecha(data.fechaVencimientoDesde) : '-'} al {data.fechaVencimientoHasta ? formatFecha(data.fechaVencimientoHasta) : '-'}</Text>
        <Text style={styles.text}>Estado: {data.estado ? data.estado : '-'}</Text>
        <Text style={styles.text}>Tipo de compra: {data.tipoCompra ? data.tipoCompra : '-'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Notas de pedido:</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Codigo</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Fecha</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Fecha Vencimiento</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Proveedor</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Estado</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Tipo Compra</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Total</Text>
            </View>
          </View>
          {notasPedidoFiltered?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{item.id}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.fecha}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.fechaVencimiento}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.proveedor}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.estadoNP}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.tipoCompra}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${item.detalleNotaPedido.reduce((acc, i) => acc + (i?.precio * (i?.cantidadPedida || 0)), 0).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
)


export default ListadoNotasPedidoPDF;