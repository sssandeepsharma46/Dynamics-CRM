/*
 * User: 202219
 * Date: 11-06-2020
 * Time: 11:33 AM
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace dotnetlittleboy.customization
{
	/// <summary>
	/// Description of Student_PostCreate.
	/// </summary>
	public class Student_PostCreate : IPlugin
	{			
		public void Execute(IServiceProvider serviceProvider)
		{
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			if(context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity){
				ITracingService tracingService =(ITracingService) serviceProvider.GetService(typeof(ITracingService));
				IOrganizationServiceFactory serviceFactory= (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
				IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
				if(context.MessageName.ToLower()!="create" && context.Stage!=40){
					return;
				}
				Guid targetEntityId = Guid.Parse(context.OutputParameters["id"].ToString());
				Entity targetEntity= service.Retrieve("dnlb_student",targetEntityId,new ColumnSet("dnlb_name","dnlb_cycle"));
				tracingService.Trace("Target entity retrieved");
				if(targetEntity != null){
					int cycle=((OptionSetValue)targetEntity["dnlb_cycle"]).Value;
					switch(cycle){
						case (int)Cycle.PCycle:
							createStudentCourse(service,tracingService,targetEntityId,targetEntity,true);
							break;
						case (int)Cycle.CCycle:
							createStudentCourse(service,tracingService,targetEntityId,targetEntity,false);
							break;
					}
				}
			}
		}
		private void createStudentCourse(IOrganizationService service, ITracingService tracingService,Guid targetEntityId, Entity targetEntity, bool isPCycle){
			tracingService.Trace("Executing creation of Student Course");
			QueryExpression qeSubject=new QueryExpression(){
				EntityName="dnlb_subject",
				ColumnSet=new ColumnSet("dnlb_name")
			};
			qeSubject.Criteria.AddCondition("dnlb_semester",ConditionOperator.Equal,(int)Semester.Semester1);
			if(isPCycle){
				qeSubject.Criteria.AddCondition("dnlb_cycle",ConditionOperator.In,(int)Cycle.PCycle,(int)Cycle.Both);
			}else{
				qeSubject.Criteria.AddCondition("dnlb_cycle",ConditionOperator.In,(int)Cycle.CCycle,(int)Cycle.Both);
			}
			EntityCollection ecSubject = service.RetrieveMultiple(qeSubject);
			tracingService.Trace("Total subject retrieved: "+ecSubject.Entities.Count);
			if(ecSubject.Entities.Count!=0){
				foreach(Entity entity in ecSubject.Entities){
					Entity createStudentCourse=new Entity("dnlb_studentcourse");
					createStudentCourse["dnlb_studentid"]=new EntityReference("dnlb_student",targetEntityId);
					createStudentCourse["dnlb_subjectsid"]=new EntityReference("dnlb_subject",entity.Id);
					createStudentCourse["dnlb_name"]=targetEntity["dnlb_name"].ToString()+" - "+entity["dnlb_name"].ToString();
					service.Create(createStudentCourse);
				}
			}
		}
	}
	
	//Cycle option set value
	public enum Cycle{
		PCycle=990000000,
		CCycle=990000001,
		Both=990000002
	}
	public enum Semester{
		Semester1=990000000,
		Semester2=990000001,
		Semester3=990000002,
		Semester4=990000003,
		Semester5=990000004,
		Semester6=990000005,
		Semester7=990000006,
		Semester8=990000007
	}
}
