import Input from '../components/Input'
import Output from '../components/Output'
import { useState } from 'react'

export interface ISection {
  section_name: string
  custom_name?: string
  fields: Record<string, any>
}
export class SectionAWS implements ISection {
  section_name = 'aws'
  fields = { aws_region_name: 'us-east-1' }
}
export class SectionGlobal implements ISection {
  section_name = 'global'
  fields = {
    cluster_template: 'default',
    update_check: true,
    sanity_check: true,
  }
}

export class SectionAliases implements ISection {
  section_name = 'aliases'
  fields = {
    ssh: 'ssh {CFN_USER}@{MASTER_IP} {ARGS}',
  }
}

class SectionCluster implements ISection {
  section_name = 'cluster'
  custom_name = 'default'
  fields: ISectionClusterFields = {
    additional_cfn_template: '',
    additional_iam_policies: '',
    base_os: 'alinux2',
    cluster_resource_bucket: '',
    cluster_type: 'ondemand',
    compute_instance_type: 't2.micro',
    compute_root_volume_size: 25,
    custom_ami: '',
    cw_log_settings: '',
    dashboard_settings: '',
    dcv_settings: '',
    desired_vcpus: 4,
    disable_cluster_dns: false,
    disable_hyperthreading: false,
    ebs_settings: [],
    ec2_iam_role: '',
    efs_settings: '',
    enable_efa: '',
    enable_efa_gdr: '',
    enable_intel_hpc_platform: false,
    encrypted_ephermeral: false,
    ephemeral_dir: '/scratch',
    extra_json: '{}',
    fsx_settings: '',
    iam_lambda_role: '',
    initial_queue_size: 2,
    key_name: '',
    maintain_initial_size: false,
    master_instance_type: 't3.micro',
    master_root_volume_size: 25,
    max_queue_size: 10,
    max_vcpus: 20,
    min_vcpus: 0,
    placement: 'compute',
    placement_group: '',
    post_install: '',
    post_install_args: '',
    pre_install: '',
    pre_install_args: '',
    proxy_server: '',
    queue_settings: [],
    raid_settings: '',
    s3_read_resource: '',
    s3_read_write_resource: '',
    scaling_settings: '',
    scheduler: 'sge',
    shared_dir: '/shared',
    spot_bid_percentage: 85,
    spot_price: undefined,
    tags: '{}',
    template_url: '',
    vpc_settings: '',
  }
}

interface ISectionClusterFields {
  additional_cfn_template: string
  additional_iam_policies: string
  base_os:
    | 'alinux'
    | 'alinux2'
    | 'centos7'
    | 'centos8'
    | 'ubuntu1604'
    | 'ubuntu1804'
  cluster_resource_bucket: string
  cluster_type: 'ondemand' | 'spot'
  compute_instance_type: string
  compute_root_volume_size: number
  custom_ami: string
  cw_log_settings: string
  dashboard_settings: string
  dcv_settings: string
  desired_vcpus: number
  disable_cluster_dns: boolean
  disable_hyperthreading: boolean
  ebs_settings: string[]
  ec2_iam_role: string
  efs_settings: string
  enable_efa: 'compute' | ''
  enable_efa_gdr: 'compute' | ''
  enable_intel_hpc_platform: boolean
  encrypted_ephermeral: boolean
  ephemeral_dir: string
  extra_json: string
  fsx_settings: string
  iam_lambda_role: string
  initial_queue_size: number
  key_name: string
  maintain_initial_size: boolean
  master_instance_type: string
  master_root_volume_size: number
  max_queue_size: number
  max_vcpus: number
  min_vcpus: number
  placement: 'cluster' | 'compute'
  placement_group: string
  post_install: string
  post_install_args: string
  pre_install: string
  pre_install_args: string
  proxy_server: string
  queue_settings: string[]
  raid_settings: string
  s3_read_resource: string
  s3_read_write_resource: string
  scaling_settings: string
  scheduler: 'awsbatch' | 'sge' | 'slurm' | 'torque'
  shared_dir: string
  spot_bid_percentage: number
  spot_price: number | undefined
  tags: string
  template_url: string
  vpc_settings: string
}

class SectionComputeResource implements ISection {
  section_name = 'compute_resource'
  custom_name = ''
  fields = {
    initial_count: 0,
    instance_type: 't2.micro',
    max_count: 10,
    min_count: 0,
    spot_price: undefined,
  }
}

const initialSectionGlobal: SectionGlobal = new SectionGlobal()
const initialSectionAWS: SectionAWS = new SectionAWS()
const initialCluster: SectionCluster = new SectionCluster()

const initialSections: ISection[] = [
  initialSectionGlobal,
  initialSectionAWS,
  initialCluster,
]

const IndexPage: React.FC = () => {
  const [sections, setSections] = useState<ISection[]>(initialSections)

  return (
    <div>
      This tool will help you create a ParallelCluster configuration file.
      <div className='flex flex-row'>
        <div className='w-1/2'>
          <Input sections={sections} setSections={setSections} />
        </div>

        <div className='w-1/2'>
          <Output sections={sections} />
        </div>
      </div>
    </div>
  )
}

export default IndexPage
