import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppFormField from '../components/AppFormField'
import SubmitButton from '../components/SubmitButton'
import ErrorMessage from '../components/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import AppSelect from '../components/forms/AppSelect'

import FormFilePicker from '../components/forms/FormFilePicker'

import doctorsApi from '../api/doctors'
import hospitalsApi from '../api/hospitals'

const accType = [
  { label: 'Savings', value: 'savings' },
  { label: 'Current', value: 'current' },
]

const qualifs = [
  { label: 'BVSc', value: 'BVSc' },
  { label: 'BVSc& AH', value: 'BVSc& AH' },
  { label: 'MVSc', value: 'MVSc' },
  { label: 'PhD', value: 'PhD' },
]

const firstAv = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

const phoneRegExp = /^[6-9]\d{9}$/
const ifscRegExp = /^[A-Z]{4}0[A-Z0-9]{6}$/
const accRegExp = /^[0-9]{9,18}$/

const validationSchema = Yup.object().shape({
  hospname: Yup.string()
    .test(
      'samefield',
      'Please either enter or select Hospital name',
      function (value) {
        const { selectHospName } = this.parent
        if (selectHospName && value) return false
        if (!selectHospName) return value != null
        return true
      }
    )
    .max(100)
    .label('Hospital/Clinic Name'),
  selectHospName: Yup.string()
    .test(
      'samefield',
      'Please either enter or select Hospital name',
      function (value) {
        const { hospname } = this.parent
        if (hospname && value) return false
        if (!hospname) return value != null
        return true
      }
    )
    .nullable()
    .label('Hospital/Clinic Name'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required()
    .label('Phone'),
  file: Yup.string()
    .required('Please select a .pdf file of size less than 1 Mb')
    .nullable()
    .label('Document'),
  acc: Yup.string()
    .matches(accRegExp, 'Account Number not valid!')
    .required()
    .label('Account No.'),
  accname: Yup.string().required().label('Name'),
  type: Yup.string()
    .required('Please Pick Account Type')
    .nullable()
    .label('Account Type'),
  qlf: Yup.string()
    .required('Please Pick a Qualifications')
    .nullable()
    .label('Qualifications'),
  ifsc: Yup.string()
    .matches(ifscRegExp, 'IFSC code is not valid!')
    .required()
    .label('IFSC Code'),
  fee: Yup.string().required().label('Consultation Fee'),
  regNo: Yup.string().required().label('Registration Number'),
  firstAvailaibeVet: Yup.string()
    .nullable()
    .required()
    .label('First Available Vet'),
})

const DetailsScreen = ({ navigation }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hospitals, setHopitals] = useState([])

  useEffect(() => {
    const getAllHospitals = async () => {
      setLoading(true)
      const res = await hospitalsApi.getHospitals()
      if (!res.ok) {
        setLoading(false)
        console.log(res)
        return
      }
      let allHospitals = res.data.hospitals

      let newHospitals = allHospitals.reduce((acc, item) => {
        acc.push({
          label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          value: item._id,
        })
        return acc
      }, [])
      setHopitals(newHospitals)
      setLoading(false)
    }
    getAllHospitals()
  }, [])

  const handleSubmit = async (values) => {
    const data = new FormData()
    if (!values.selectHospName) {
      setLoading(true)
      const hosRes = await hospitalsApi.saveHospitalName(values.hospname)
      if (!hosRes.ok) {
        setLoading(false)
        alert(hosRes.data.msg)
        // setError(hosRes.data.msg);
        return
      }
      data.append('hospital', hosRes.data.newHospital._id)
    } else {
      data.append('hospital', values.selectHospName)
    }
    data.append('file', {
      name: 'file',
      type: 'application/pdf',
      uri: values.file,
    })
    data.append('phone', values.phone)
    data.append('accno', values.acc)
    data.append('accname', values.accname)
    data.append('acctype', values.type)
    data.append('ifsc', values.ifsc)
    data.append('fee', values.fee)
    data.append('qlf', values.qlf)
    data.append('firstAvailaibeVet', values.firstAvailaibeVet)
    data.append('regNo', values.regNo)
    setLoading(true)
    const res = await doctorsApi.saveDoctor(data)
    if (!res.ok) {
      setLoading(false)
      setError(res.data?.msg)
      console.log(res)
    }
    setLoading(false)

    alert('Your data has been saved!')
    navigation.navigate('Home')
    setError(null)
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView>
        <View style={styles.container}>
          <AppText
            style={{
              marginBottom: 30,
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 22,
              marginTop: -22,
            }}
          >
            Provide your details below
          </AppText>

          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={{
              hospname: '',
              selectHospName: '',
              phone: '',
              file: '',
              acc: '',
              accname: '',
              type: '',
              ifsc: '',
              fee: '',
              qlf: '',
              regNo: '',
              firstAvailaibeVet: false,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <FormFilePicker name='file' size={1} />

                <AppFormField
                  label='Hospital/Clinic Name'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='hospname'
                  numberOfLines={2}
                  placeholder='Hospital/Clinic Name'
                />
                <AppText
                  style={{ textAlign: 'center', fontSize: 22, margin: 10 }}
                >
                  OR
                </AppText>

                <AppSelect
                  items={hospitals}
                  label='Select Hospital Name If Exists!'
                  name='selectHospName'
                />

                <AppFormField
                  label='Registration Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='regNo'
                  keyboardType='numeric'
                  placeholder='Enter your registration number'
                  maxLength={10}
                />

                <AppSelect
                  items={qualifs}
                  label='Select Your Qualifications'
                  name='qlf'
                />

                <AppSelect
                  items={firstAv}
                  label='Want to be first available vet?'
                  name='firstAvailaibeVet'
                />

                <AppFormField
                  label='Phone Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='phone'
                  keyboardType='numeric'
                  placeholder='Enter your phone number'
                  maxLength={10}
                />

                <AppFormField
                  label='Consultation Fee'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='fee'
                  keyboardType='numeric'
                  placeholder='consultation fee in ruppes (₹)'
                />

                <AppText
                  style={{
                    textAlign: 'center',
                    marginVertical: 20,
                    fontSize: 28,
                    textDecorationLine: 'underline',
                  }}
                >
                  Bank Details
                </AppText>

                <AppFormField
                  label='Account Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='numeric'
                  name='acc'
                  maxLength={18}
                  placeholder='xxxx xxxx xxxx xxxx'
                />
                <AppFormField
                  label='Name On Card'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='accname'
                  placeholder='Name On Card'
                />

                <AppSelect items={accType} label='Account Type' name='type' />

                <AppFormField
                  label='IFSC Code'
                  autoCapitalize='characters'
                  autoCorrect={false}
                  name='ifsc'
                  placeholder='Enter your bank ifsc code'
                  maxLength={11}
                />

                <SubmitButton title='Submit' />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
  },
})

export default DetailsScreen
