import ConfigForm from '../components/ConfigForm'
import Output from '../components/Output'
import { FaNetworkWired, FaServer } from 'react-icons/fa'
import {
  RiShareForwardFill,
  RiFileHistoryLine,
  RiGroupLine,
} from 'react-icons/ri'
import { AiOutlineDashboard, AiOutlineGateway } from 'react-icons/ai'
import { FiHardDrive } from 'react-icons/fi'
import { GiTvRemote, GiStoneBlock } from 'react-icons/gi'
import { BsCloud } from 'react-icons/bs'
import { GrMultiple, GrDriveCage } from 'react-icons/gr'
import { useState } from 'react'
import { useCallback } from 'react'
import produce from 'immer'

// export type TSectionState = Omit<ISection, 'fields'> & {
//   fields: Record<string, string | number | boolean | string[] | null>
// }

export interface ISection {
  required?: boolean
  section_name: string
  custom_name?: string
  fields: Record<string, ISectionField>
}
export class SectionAWS implements ISection {
  required = true
  section_name = 'aws'
  fields = {
    aws_region_name: {
      default: 'us-east-1',
      allowed_values: [
        'us-east-2',
        'us-east-1',
        'us-west-1',
        'us-west-2',
        'af-south-1',
        'ap-east-1',
        'ap-south-1',
        'ap-northeast-2',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-northeast-1',
        'ca-central-1',
        'cn-north-1',
        'cn-northwest-1',
        'eu-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-south-1',
        'eu-west-3',
        'eu-north-1',
        'me-south-1',
        'sa-east-1',
        'us-gov-east-1',
        'us-gov-west-1',
      ],
    },
  }
}
export class SectionGlobal implements ISection {
  required = true
  section_name = 'global'
  fields = {
    cluster_template: { default: 'default' },
    update_check: { default: true },
    sanity_check: { default: true },
  }
}

export class SectionAliases implements ISection {
  section_name = 'aliases'
  fields = {
    ssh: { default: 'ssh {CFN_USER}@{MASTER_IP} {ARGS}' },
  }
}
type FieldValueType = string | number | boolean | string[] | null

export interface ISectionField {
  allowed_values?: string[] | number[]
  default: FieldValueType
}
export type ISectionStateField = ISectionField & {
  value: FieldValueType
}

class SectionCluster implements ISection {
  section_name = 'cluster'
  custom_name = 'default'
  fields = {
    additional_cfn_template: { default: '' },
    additional_iam_policies: { default: '' },
    base_os: {
      default: 'alinux2',
      allowed_values: [
        'alinux',
        'alinux2',
        'centos7',
        'centos8',
        'ubuntu1604',
        'ubuntu1804',
      ],
    },
    cluster_resource_bucket: { default: '' },
    cluster_type: { default: 'ondemand', allowed_values: ['ondemand', 'spot'] },
    compute_instance_type: { default: 't2.micro' },
    compute_root_volume_size: { default: 25 },
    custom_ami: { default: '' },
    cw_log_settings: { default: '' },
    dashboard_settings: { default: '' },
    dcv_settings: { default: '' },
    desired_vcpus: { default: 4 },
    disable_cluster_dns: { default: false },
    disable_hyperthreading: { default: false },
    ebs_settings: { default: [] },
    ec2_iam_role: { default: '' },
    efs_settings: { default: '' },
    enable_efa: { default: '', allowed_values: ['compute', ''] },
    enable_efa_gdr: { default: '', allowed_values: ['compute', ''] },
    enable_intel_hpc_platform: { default: false },
    encrypted_ephermeral: { default: false },
    ephemeral_dir: { default: '/scratch' },
    extra_json: { default: '{}' },
    fsx_settings: { default: '' },
    iam_lambda_role: { default: '' },
    initial_queue_size: { default: 2 },
    key_name: { default: '' },
    maintain_initial_size: { default: false },
    master_instance_type: { default: 't3.micro' },
    master_root_volume_size: { default: 25 },
    max_queue_size: { default: 10 },
    max_vcpus: { default: 20 },
    min_vcpus: { default: 0 },
    placement: { default: 'compute', allowed_values: ['cluster', 'compute'] },
    placement_group: { default: '' },
    post_install: { default: '' },
    post_install_args: { default: '' },
    pre_install: { default: '' },
    pre_install_args: { default: '' },
    proxy_server: { default: '' },
    queue_settings: { default: [] },
    raid_settings: { default: '' },
    s3_read_resource: { default: '' },
    s3_read_write_resource: { default: '' },
    scaling_settings: { default: '' },
    scheduler: {
      default: 'sge',
      allowed_values: ['awsbatch', 'sge', 'slurm', 'torque'],
    },
    shared_dir: { default: '/shared' },
    spot_bid_percentage: { default: 85 },
    spot_price: { default: null },
    tags: { default: '{}' },
    template_url: { default: '' },
    vpc_settings: { default: '' },
  }
}

class SectionCWLog implements ISection {
  section_name = 'cw_log'
  custom_name = ''
  fields = {
    enable: { default: true },
    retention_days: {
      default: 14,
      allowed_values: [
        1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827,
        3653,
      ],
    },
  }
}

class SectionComputeResource implements ISection {
  section_name = 'compute_resource'
  custom_name = ''
  fields = {
    initial_count: { default: 0 },
    instance_type: { default: 't2.micro' },
    max_count: { default: 10 },
    min_count: { default: 0 },
    spot_price: { default: null },
  }
}

class SectionDashboard implements ISection {
  section_name = 'dashboard'
  custom_name = ''
  fields = {
    enable: { default: true },
  }
}
class SectionDCV implements ISection {
  section_name = 'dcv'
  custom_name = ''
  fields = {
    access_from: { default: '0.0.0.0/0' },
    enable: { default: 'master' },
    port: { default: 8443 },
  }
}
class SectionEBS implements ISection {
  section_name = 'ebs'
  custom_name = ''
  fields = {
    shared_dir: { default: '' },
    ebs_kms_key_id: { default: '' },
    ebs_snapshot_id: { default: '' },
    ebs_volume_id: { default: '' },
    encrypted: { default: false },
    volume_iops: { default: 3000 },
    volume_size: { default: 80 },
    volume_throughput: { default: 125 },
    volume_type: {
      default: 'gp2',
      allowed_values: ['gp2', 'gp3', 'io1', 'io2', 'st1', 'sc1', 'standard'],
    },
  }
}
class SectionEFS implements ISection {
  section_name = 'efs'
  custom_name = ''
  fields = {
    efs_fs_id: { default: '' },
    efs_kms_key_id: { default: '' },

    encrypted: { default: false },
    performance_mode: {
      default: 'generalPurpose',
      allowed_values: ['generalPurpose, maxIO'],
    },
    provisioned_throughput: { default: 512 },
    volume_throughput: { default: 125 },
    shared_dir: { default: '' },
    throughput_mode: {
      default: 'bursting',
      allowed_values: ['bursting', 'provisioned'],
    },
  }
}
class SectionFSX implements ISection {
  section_name = 'fsx'
  custom_name = ''
  fields = {
    auto_import_policy: {
      default: 'NEW',
      allowed_values: ['NEW', 'NEW_CHANGED'],
    },
    automatic_backup_retention_days: {
      default: 0,
    },
    copy_tags_to_backups: {
      default: false,
    },
    daily_automatic_backup_start_time: {
      default: '03:00',
    },
    deployment_type: {
      default: 'SCRATCH_1',
      allowed_values: ['SCRATCH_1', 'SCRATCH_2', 'PERSISTENT_1'],
    },
    drive_cache_type: {
      default: 'READ',
      allowed_values: ['', 'READ'],
    },
    export_path: { default: '' },
    fsx_backup_id: { default: '' },
    fsx_fs_id: { default: '' },
    fsx_kms_key_id: { default: '' },
    import_path: { default: '' },
    imported_file_chunk_size: { default: '' },
    per_unit_storage_throughput: {
      default: 50,
      allowed_values: [50, 100, 200, 12, 40],
    },
    shared_dir: { default: '' },
    storage_capacity: {
      default: 1200,
    },
    storage_type: {
      default: 'SSD',
      allowed_values: ['HDD', 'SSD'],
    },
    weekly_maintenance_start_time: {
      default: '1:00:00',
    },
  }
}

class SectionQueue implements ISection {
  section_name = 'queue'
  custom_name = ''
  fields = {
    compute_resource_settings: { default: '' },
    compute_type: { default: 'ondemand', allowed_values: ['ondemand', 'spot'] },
    disable_hyperthreading: { default: false },
    enable_efa: { default: true },
    enable_efa_gdr: { default: false },
    placement_group: { default: '' },
  }
}

class SectionRaid implements ISection {
  section_name = 'raid'
  custom_name = ''
  fields = {
    shared_dir: { default: '' },
    ebs_kms_key_id: { default: '' },
    encrypted: { default: false },
    num_of_raid_volumes: { default: 2, allowed_values: [2, 3, 4, 5] },
    raid_type: { default: 0, allowed_values: [0, 1] },
    volume_iops: { default: 3000 },
    volume_size: { default: 80 },
    volume_throughput: { default: 125 },
    volume_type: {
      default: 'gp2',
      allowed_values: ['gp2', 'gp3', 'io1', 'io2', 'st1', 'sc1', 'standard'],
    },
  }
}

class SectionScaling implements ISection {
  section_name = 'scaling'
  custom_name = ''
  fields = {
    scaledown_idletime: { default: 10 },
  }
}

class SectionVPC implements ISection {
  section_name = 'vpc'
  custom_name = ''
  fields = {
    additional_sg: { default: '' },
    compute_subnet_cidr: { default: '' },
    compute_subnet_id: { default: '' },
    ssh_from: { default: '0.0.0.0/0' },
    use_public_ips: { default: true },
    vpc_id: { default: '' },
    vpc_security_group_id: { default: '' },
  }
}

export interface ISectionState extends ISection {
  fields: Record<string, ISectionStateField>
}

const createSection = (section: ISection): ISectionState => {
  const newFields = Object.entries(section.fields).reduce(
    (acc, [currKey, currVal]) => ({
      ...acc,
      [currKey]: { ...currVal, value: currVal.default },
    }),
    {}
  )
  return { ...section, fields: newFields }
}

const IndexPage: React.FC = () => {
  const [sections, setSections] = useState<ISectionState[]>([
    createSection(new SectionGlobal()),
    createSection(new SectionAWS()),
  ])

  const AddCluster = useCallback(() => {
    setSections([...sections, createSection(new SectionCluster())])
  }, [sections])
  const AddComputeResource = useCallback(() => {
    setSections([...sections, createSection(new SectionComputeResource())])
  }, [sections])
  const AddAliases = useCallback(() => {
    setSections([...sections, createSection(new SectionAliases())])
  }, [sections])
  const AddCWLogs = useCallback(() => {
    setSections([...sections, createSection(new SectionCWLog())])
  }, [sections])
  const AddDashboard = useCallback(() => {
    setSections([...sections, createSection(new SectionDashboard())])
  }, [sections])
  const AddDCV = useCallback(() => {
    setSections([...sections, createSection(new SectionDCV())])
  }, [sections])
  const AddEBS = useCallback(() => {
    setSections([...sections, createSection(new SectionEBS())])
  }, [sections])
  const AddEFS = useCallback(() => {
    setSections([...sections, createSection(new SectionEFS())])
  }, [sections])
  const AddFSX = useCallback(() => {
    setSections([...sections, createSection(new SectionFSX())])
  }, [sections])
  const AddQueue = useCallback(() => {
    setSections([...sections, createSection(new SectionQueue())])
  }, [sections])
  const AddRaid = useCallback(() => {
    setSections([...sections, createSection(new SectionRaid())])
  }, [sections])

  const AddScaling = useCallback(() => {
    setSections([...sections, createSection(new SectionScaling())])
  }, [sections])
  const AddVPC = useCallback(() => {
    setSections([...sections, createSection(new SectionVPC())])
  }, [sections])

  const deleteSection = useCallback(
    (sectionIndex: number) => {
      const nextSections = produce(sections, (draft) => {
        draft.splice(sectionIndex, 1)
      })
      setSections(nextSections)
    },
    [sections]
  )

  return (
    <div className='container mx-auto'>
      This tool will help you create a ParallelCluster configuration file.
      <div className='flex flex-row'>
        <div className='w-full'>
          <ConfigForm
            deleteSection={deleteSection}
            sections={sections}
            setSections={setSections}
          />
        </div>

        <div className='w-1/2'>
          <Output sections={sections} />
        </div>
      </div>
      <div>
        <h1 className='text-xl font-medium my-4'>Add section</h1>
        <div className='flex flex-row flex-wrap w-1/2 items-center'>
          <button
            onClick={AddCluster}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <FaNetworkWired className='mr-1' />
            <span>Cluster</span>
          </button>
          <button
            onClick={AddComputeResource}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <FaServer className='mr-1' />
            <span>Compute Resource</span>
          </button>
          <button
            onClick={AddAliases}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <RiShareForwardFill className='mr-1' />
            <span>Aliases</span>
          </button>
          <button
            onClick={AddCWLogs}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <RiFileHistoryLine className='mr-1' />
            <span>cw_log</span>
          </button>
          <button
            onClick={AddDashboard}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <AiOutlineDashboard className='mr-1' />
            <span>dashboard</span>
          </button>
          <button
            onClick={AddDCV}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <GiTvRemote className='mr-1' />
            <span>dcv</span>
          </button>
          <button
            onClick={AddEBS}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <GiStoneBlock className='mr-1' />
            <span>ebs</span>
          </button>
          <button
            onClick={AddEFS}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <FiHardDrive className='mr-1' />
            <span>efs</span>
          </button>
          <button
            onClick={AddFSX}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <AiOutlineGateway className='mr-1' />
            <span>fsx</span>
          </button>
          <button
            onClick={AddQueue}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <RiGroupLine className='mr-1' />
            <span>Queue</span>
          </button>
          <button
            onClick={AddRaid}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <GrDriveCage className='mr-1 bg-white' />
            <span>Raid</span>
          </button>
          <button
            onClick={AddScaling}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <GrMultiple className='mr-1 bg-white' />
            <span>Scaling</span>
          </button>
          <button
            onClick={AddVPC}
            className='flex bg-gray-900 text-white rounded-lg p-2 m-1  text-4xl'
          >
            <BsCloud className='mr-1' />
            <span>VPC</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
