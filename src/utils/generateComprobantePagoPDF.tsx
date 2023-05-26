// @ts-ignore
import { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import Icono from "/404_Icono.png";
import { Comprobante } from "@/interfaces/Comprobante";

interface ComprobantePagoPDFProps {
  comprobante: Comprobante
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

const ComprobantePagoPDF = ({ comprobante }: ComprobantePagoPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/404_Icono.png" />
        </View>
        <Text style={styles.title}>Nro de comprobante: {comprobante.numeroFactura}</Text>
        <Text style={styles.subtitle}>Fecha: {new Date(comprobante.fecha).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
        {/* <Text style={styles.subtitle}>Fecha de vencimiento: {new Date(comprobante.fechaVencimiento).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text> */}
        <Text style={styles.subtitle}>Estado: {comprobante.estadoFactura}</Text>
        <Text style={styles.text}>Nombre: {comprobante.usuario?.nombre}</Text>
        <Text style={styles.text}>Apellido: {comprobante.usuario?.apellido}</Text>
        <Text style={styles.text}>Email: {comprobante.usuario?.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalle del comprobante:</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Producto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Precio</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>Cantidad</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBold}>SubTotal</Text>
            </View>
          </View>
          {comprobante.detalleComprobante.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{item.producto?.nombre}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${item.precio}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{item.cantidad}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${item.precio * item.cantidad}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.total}>Total: ${comprobante.detalleComprobante.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)}</Text>
      </View>
    </Page>
  </Document>
)


export default ComprobantePagoPDF;