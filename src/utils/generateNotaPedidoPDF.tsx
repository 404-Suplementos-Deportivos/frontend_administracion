// @ts-ignore
import { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import Icono from "/404_Icono.png";
import { NotaPedido } from "@/interfaces/NotaPedido";

interface NotaPedidoPDFProps {
  notaPedido: NotaPedido
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

const NotaPedidoPDF = ({ notaPedido }: NotaPedidoPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/404_Icono.png" />
        </View>
        <Text style={styles.title}>Nro de nota de pedido: #{notaPedido.id}</Text>
        <Text style={styles.subtitle}>Fecha: {new Date(notaPedido.fecha).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
        <Text style={styles.subtitle}>Fecha de vencimiento: {new Date(notaPedido.fechaVencimiento).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
        <Text style={styles.subtitle}>Estado: {notaPedido.estadoNP}</Text>
        <Text style={styles.subtitle}>Tipo de compra: {notaPedido.tipoCompra}</Text>
        <Text style={styles.text}>Proveedor: {notaPedido.proveedor}</Text>
        <Text style={styles.text}>Dirección: {notaPedido.proveedorDireccion}</Text>
        <Text style={styles.text}>E-Mail: {notaPedido.proveedorEmail}</Text>
        <Text style={styles.text}>Teléfono: {notaPedido.proveedorTelefono}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalle de nota de pedido:</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Producto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Precio</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Cantidad Pedida</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Cantidad Recibida</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>SubTotal</Text>
            </View>
          </View>
          {notaPedido.detalleNotaPedido.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{item.producto}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${item.precio}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.cantidadPedida}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.cantidadRecibida}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${item.precio * (item.cantidadRecibida || 0)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.total}>Total: ${notaPedido.detalleNotaPedido.reduce((acc, item) => acc + (item.precio * (item.cantidadRecibida || 0)), 0)}</Text>
      </View>
    </Page>
  </Document>
)


export default NotaPedidoPDF;